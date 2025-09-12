# Zeeky Infrastructure - Main Configuration
# This file defines the core infrastructure for the Zeeky AI Assistant platform

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }
}

# Configure AWS Provider
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "Zeeky"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Configure Kubernetes Provider
provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

# Configure Helm Provider
provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}

# Data sources
data "aws_eks_cluster" "cluster" {
  name = aws_eks_cluster.zeeky_cluster.name
}

data "aws_eks_cluster_auth" "cluster" {
  name = aws_eks_cluster.zeeky_cluster.name
}

# VPC and Networking
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.cluster_name}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway     = true
  enable_vpn_gateway     = false
  enable_dns_hostnames   = true
  enable_dns_support     = true

  tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }

  public_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                    = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"           = "1"
  }
}

# EKS Cluster
resource "aws_eks_cluster" "zeeky_cluster" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = module.vpc.private_subnets
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs    = var.public_access_cidrs
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_resource_controller,
  ]

  tags = {
    Name = "${var.cluster_name}-cluster"
  }
}

# EKS Node Group
resource "aws_eks_node_group" "zeeky_nodes" {
  cluster_name    = aws_eks_cluster.zeeky_cluster.name
  node_group_name = "${var.cluster_name}-nodes"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = module.vpc.private_subnets
  instance_types  = var.node_instance_types

  scaling_config {
    desired_size = var.node_desired_size
    max_size     = var.node_max_size
    min_size     = var.node_min_size
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry_readonly,
  ]

  tags = {
    Name = "${var.cluster_name}-node-group"
  }
}

# RDS PostgreSQL Database
resource "aws_db_subnet_group" "zeeky_db_subnet_group" {
  name       = "${var.cluster_name}-db-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Name = "${var.cluster_name}-db-subnet-group"
  }
}

resource "aws_db_instance" "zeeky_postgres" {
  identifier = "${var.cluster_name}-postgres"

  engine         = "postgres"
  engine_version = var.postgres_version
  instance_class = var.postgres_instance_class

  allocated_storage     = var.postgres_allocated_storage
  max_allocated_storage = var.postgres_max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.postgres_db_name
  username = var.postgres_username
  password = var.postgres_password

  vpc_security_group_ids = [aws_security_group.postgres_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.zeeky_db_subnet_group.name

  backup_retention_period = var.postgres_backup_retention_period
  backup_window          = var.postgres_backup_window
  maintenance_window     = var.postgres_maintenance_window

  skip_final_snapshot = var.environment != "production"
  deletion_protection = var.environment == "production"

  tags = {
    Name = "${var.cluster_name}-postgres"
  }
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "zeeky_redis_subnet_group" {
  name       = "${var.cluster_name}-redis-subnet-group"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_elasticache_replication_group" "zeeky_redis" {
  replication_group_id       = "${var.cluster_name}-redis"
  description                = "Redis cluster for Zeeky"

  node_type            = var.redis_node_type
  port                 = 6379
  parameter_group_name = "default.redis7"

  num_cache_clusters = var.redis_num_cache_nodes

  subnet_group_name  = aws_elasticache_subnet_group.zeeky_redis_subnet_group.name
  security_group_ids = [aws_security_group.redis_sg.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  tags = {
    Name = "${var.cluster_name}-redis"
  }
}

# S3 Bucket for MinIO-like object storage
resource "aws_s3_bucket" "zeeky_storage" {
  bucket = "${var.cluster_name}-storage-${random_string.bucket_suffix.result}"

  tags = {
    Name = "${var.cluster_name}-storage"
  }
}

resource "aws_s3_bucket_versioning" "zeeky_storage_versioning" {
  bucket = aws_s3_bucket.zeeky_storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "zeeky_storage_encryption" {
  bucket = aws_s3_bucket.zeeky_storage.id

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "zeeky_storage_pab" {
  bucket = aws_s3_bucket.zeeky_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Security Groups
resource "aws_security_group" "postgres_sg" {
  name_prefix = "${var.cluster_name}-postgres-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.cluster_name}-postgres-sg"
  }
}

resource "aws_security_group" "redis_sg" {
  name_prefix = "${var.cluster_name}-redis-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.cluster_name}-redis-sg"
  }
}

# IAM Roles and Policies
resource "aws_iam_role" "eks_cluster_role" {
  name = "${var.cluster_name}-cluster-role"

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role_policy_attachment" "eks_vpc_resource_controller" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role" "eks_node_role" {
  name = "${var.cluster_name}-node-role"

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_container_registry_readonly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
}

# Random string for bucket suffix
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Outputs
output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = aws_eks_cluster.zeeky_cluster.endpoint
}

output "cluster_security_group_id" {
  description = "Security group ids attached to the cluster control plane"
  value       = aws_eks_cluster.zeeky_cluster.vpc_config[0].cluster_security_group_id
}

output "cluster_iam_role_name" {
  description = "IAM role name associated with EKS cluster"
  value       = aws_iam_role.eks_cluster_role.name
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = aws_eks_cluster.zeeky_cluster.certificate_authority[0].data
}

output "cluster_name" {
  description = "The name/id of the EKS cluster"
  value       = aws_eks_cluster.zeeky_cluster.name
}

output "postgres_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.zeeky_postgres.endpoint
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = aws_elasticache_replication_group.zeeky_redis.configuration_endpoint_address
}

output "s3_bucket_name" {
  description = "S3 bucket name for object storage"
  value       = aws_s3_bucket.zeeky_storage.bucket
}