# Zeeky Infrastructure - Variables
# This file defines all the variables used in the Terraform configuration

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be one of: dev, staging, production."
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "zeeky-cluster"
}

variable "kubernetes_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.28"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b", "us-west-2c"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "public_access_cidrs" {
  description = "CIDR blocks that can access the EKS API server"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# EKS Node Group Configuration
variable "node_instance_types" {
  description = "Instance types for the node group"
  type        = list(string)
  default     = ["t3.medium", "t3.large"]
}

variable "node_desired_size" {
  description = "Desired number of nodes in the node group"
  type        = number
  default     = 3
}

variable "node_min_size" {
  description = "Minimum number of nodes in the node group"
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum number of nodes in the node group"
  type        = number
  default     = 10
}

# PostgreSQL Configuration
variable "postgres_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "postgres_instance_class" {
  description = "RDS instance class for PostgreSQL"
  type        = string
  default     = "db.t3.micro"
}

variable "postgres_allocated_storage" {
  description = "Initial allocated storage for PostgreSQL (GB)"
  type        = number
  default     = 20
}

variable "postgres_max_allocated_storage" {
  description = "Maximum allocated storage for PostgreSQL (GB)"
  type        = number
  default     = 100
}

variable "postgres_db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "zeeky"
}

variable "postgres_username" {
  description = "Username for PostgreSQL"
  type        = string
  default     = "zeeky"
}

variable "postgres_password" {
  description = "Password for PostgreSQL"
  type        = string
  sensitive   = true
  default     = ""
}

variable "postgres_backup_retention_period" {
  description = "Backup retention period for PostgreSQL (days)"
  type        = number
  default     = 7
}

variable "postgres_backup_window" {
  description = "Backup window for PostgreSQL"
  type        = string
  default     = "03:00-04:00"
}

variable "postgres_maintenance_window" {
  description = "Maintenance window for PostgreSQL"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

# Redis Configuration
variable "redis_node_type" {
  description = "Instance type for Redis nodes"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes in Redis cluster"
  type        = number
  default     = 2
}

# Domain Configuration
variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "zeeky.local"
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate"
  type        = string
  default     = ""
}

# Monitoring Configuration
variable "enable_monitoring" {
  description = "Enable monitoring stack (Prometheus, Grafana)"
  type        = bool
  default     = true
}

variable "enable_logging" {
  description = "Enable centralized logging"
  type        = bool
  default     = true
}

variable "enable_tracing" {
  description = "Enable distributed tracing"
  type        = bool
  default     = true
}

# Scaling Configuration
variable "enable_autoscaling" {
  description = "Enable horizontal pod autoscaling"
  type        = bool
  default     = true
}

variable "min_replicas" {
  description = "Minimum number of replicas for core services"
  type        = number
  default     = 2
}

variable "max_replicas" {
  description = "Maximum number of replicas for core services"
  type        = number
  default     = 10
}

variable "target_cpu_utilization" {
  description = "Target CPU utilization for autoscaling"
  type        = number
  default     = 70
}

# Security Configuration
variable "enable_network_policies" {
  description = "Enable Kubernetes network policies"
  type        = bool
  default     = true
}

variable "enable_pod_security_standards" {
  description = "Enable Pod Security Standards"
  type        = bool
  default     = true
}

variable "enable_rbac" {
  description = "Enable Role-Based Access Control"
  type        = bool
  default     = true
}

# Resource Limits
variable "resource_limits" {
  description = "Resource limits for containers"
  type = object({
    cpu    = string
    memory = string
  })
  default = {
    cpu    = "1000m"
    memory = "2Gi"
  }
}

variable "resource_requests" {
  description = "Resource requests for containers"
  type = object({
    cpu    = string
    memory = string
  })
  default = {
    cpu    = "100m"
    memory = "256Mi"
  }
}

# Tags
variable "additional_tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}

# Feature Flags
variable "enable_plugins" {
  description = "Enable plugin system"
  type        = bool
  default     = true
}

variable "enable_mobile_sdk" {
  description = "Enable mobile SDK features"
  type        = bool
  default     = true
}

variable "enable_voice_interface" {
  description = "Enable voice interface features"
  type        = bool
  default     = false
}

variable "enable_enterprise_features" {
  description = "Enable enterprise features"
  type        = bool
  default     = false
}