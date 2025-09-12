# Zeeky Infrastructure - Outputs
# This file defines the outputs from the Terraform configuration

# Cluster Information
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

output "cluster_arn" {
  description = "The Amazon Resource Name (ARN) of the cluster"
  value       = aws_eks_cluster.zeeky_cluster.arn
}

output "cluster_version" {
  description = "The Kubernetes version for the EKS cluster"
  value       = aws_eks_cluster.zeeky_cluster.version
}

# VPC Information
output "vpc_id" {
  description = "ID of the VPC where the cluster is deployed"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnets
}

output "nat_public_ips" {
  description = "List of public Elastic IPs created for AWS NAT Gateway"
  value       = module.vpc.nat_public_ips
}

# Database Information
output "postgres_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.zeeky_postgres.endpoint
  sensitive   = true
}

output "postgres_port" {
  description = "RDS PostgreSQL port"
  value       = aws_db_instance.zeeky_postgres.port
}

output "postgres_db_name" {
  description = "RDS PostgreSQL database name"
  value       = aws_db_instance.zeeky_postgres.db_name
}

output "postgres_username" {
  description = "RDS PostgreSQL username"
  value       = aws_db_instance.zeeky_postgres.username
  sensitive   = true
}

output "postgres_arn" {
  description = "RDS PostgreSQL ARN"
  value       = aws_db_instance.zeeky_postgres.arn
}

# Redis Information
output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = aws_elasticache_replication_group.zeeky_redis.configuration_endpoint_address
  sensitive   = true
}

output "redis_port" {
  description = "ElastiCache Redis port"
  value       = aws_elasticache_replication_group.zeeky_redis.port
}

output "redis_arn" {
  description = "ElastiCache Redis ARN"
  value       = aws_elasticache_replication_group.zeeky_redis.arn
}

# Storage Information
output "s3_bucket_name" {
  description = "S3 bucket name for object storage"
  value       = aws_s3_bucket.zeeky_storage.bucket
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.zeeky_storage.arn
}

output "s3_bucket_domain_name" {
  description = "S3 bucket domain name"
  value       = aws_s3_bucket.zeeky_storage.bucket_domain_name
}

# Security Information
output "postgres_security_group_id" {
  description = "Security group ID for PostgreSQL"
  value       = aws_security_group.postgres_sg.id
}

output "redis_security_group_id" {
  description = "Security group ID for Redis"
  value       = aws_security_group.redis_sg.id
}

# Node Group Information
output "node_group_arn" {
  description = "EKS Node Group ARN"
  value       = aws_eks_node_group.zeeky_nodes.arn
}

output "node_group_status" {
  description = "EKS Node Group status"
  value       = aws_eks_node_group.zeeky_nodes.status
}

# Connection Information
output "kubeconfig_command" {
  description = "Command to update kubeconfig"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.zeeky_cluster.name}"
}

output "helm_install_command" {
  description = "Command to install Zeeky with Helm"
  value       = "helm install zeeky ../helm/zeeky --namespace zeeky --create-namespace"
}

# Environment-specific outputs
output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

# Application URLs (placeholder - would be set by ingress controller)
output "frontend_url" {
  description = "Frontend application URL"
  value       = "https://${var.domain_name}"
}

output "api_url" {
  description = "API endpoint URL"
  value       = "https://api.${var.domain_name}"
}

output "grafana_url" {
  description = "Grafana dashboard URL"
  value       = var.enable_monitoring ? "https://grafana.${var.domain_name}" : null
}

output "prometheus_url" {
  description = "Prometheus metrics URL"
  value       = var.enable_monitoring ? "https://prometheus.${var.domain_name}" : null
}

# Resource counts
output "total_resources" {
  description = "Summary of created resources"
  value = {
    vpc_subnets     = length(module.vpc.private_subnets) + length(module.vpc.public_subnets)
    availability_zones = length(var.availability_zones)
    node_group_size = var.node_desired_size
    database_size   = var.postgres_allocated_storage
    redis_nodes     = var.redis_num_cache_nodes
  }
}

# Cost estimation (approximate)
output "estimated_monthly_cost" {
  description = "Estimated monthly cost for the infrastructure"
  value = {
    eks_cluster    = "~$73/month"
    ec2_instances  = "~$150/month (3x t3.medium)"
    rds_postgres   = "~$25/month (db.t3.micro)"
    elasticache    = "~$50/month (2x cache.t3.micro)"
    nat_gateway    = "~$45/month"
    total_estimate = "~$343/month"
    note           = "Costs are estimates and may vary based on usage"
  }
}