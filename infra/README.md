# Zeeky Infrastructure

Infrastructure as Code (IaC) configurations for deploying and managing the Zeeky AI Assistant platform.

## Overview

This directory contains infrastructure configurations for:
- **Terraform**: Cloud infrastructure provisioning
- **Helm**: Kubernetes application deployments
- **Kubernetes**: Native K8s manifests
- **Docker**: Container configurations

## Quick Start

### Prerequisites

- Terraform >= 1.5
- Helm >= 3.12
- kubectl >= 1.28
- Docker >= 24.0

### Deployment Options

#### Option 1: Terraform + Helm (Recommended)
```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

#### Option 2: Helm Only
```bash
cd infra/helm/zeeky
helm install zeeky . -n zeeky --create-namespace
```

#### Option 3: Kubernetes Manifests
```bash
kubectl apply -f infra/k8s/
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Zeeky Platform                          │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React)     │  Kernel (FastAPI)  │  Plugins     │
├─────────────────────────────────────────────────────────────┤
│  Redis Cache          │  PostgreSQL DB     │  MinIO S3    │
├─────────────────────────────────────────────────────────────┤
│  Nginx Ingress        │  Cert Manager      │  Monitoring  │
└─────────────────────────────────────────────────────────────┘
```

## Components

### Core Services
- **Frontend**: React dashboard with Tailwind CSS
- **Kernel**: FastAPI backend service
- **Plugin Manager**: Dynamic plugin loading and management
- **AI Manager**: LLM integration and processing

### Data Layer
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **MinIO**: Object storage for files and artifacts

### Infrastructure
- **Nginx Ingress**: Load balancing and SSL termination
- **Cert Manager**: Automatic SSL certificate management
- **Prometheus**: Metrics collection
- **Grafana**: Monitoring dashboards
- **Jaeger**: Distributed tracing

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
POSTGRES_HOST=postgres.zeeky.svc.cluster.local
POSTGRES_DB=zeeky
POSTGRES_USER=zeeky
POSTGRES_PASSWORD=your-secure-password

# Redis
REDIS_HOST=redis.zeeky.svc.cluster.local
REDIS_PORT=6379

# MinIO
MINIO_ENDPOINT=minio.zeeky.svc.cluster.local
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key

# AI Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

### Terraform Variables

Edit `infra/terraform/variables.tf`:

```hcl
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "cluster_name" {
  description = "Kubernetes cluster name"
  type        = string
  default     = "zeeky-cluster"
}

variable "domain" {
  description = "Domain name for the application"
  type        = string
  default     = "zeeky.ai"
}
```

## Deployment

### Production Deployment

1. **Set up infrastructure**:
   ```bash
   cd infra/terraform
   terraform init
   terraform plan -var="environment=production"
   terraform apply -var="environment=production"
   ```

2. **Deploy applications**:
   ```bash
   cd infra/helm/zeeky
   helm upgrade --install zeeky . \
     --namespace zeeky \
     --create-namespace \
     --values values-production.yaml
   ```

3. **Verify deployment**:
   ```bash
   kubectl get pods -n zeeky
   kubectl get services -n zeeky
   ```

### Development Deployment

```bash
# Quick dev setup
kubectl apply -f infra/k8s/dev/
```

## Monitoring

### Accessing Dashboards

- **Grafana**: https://grafana.zeeky.ai
- **Prometheus**: https://prometheus.zeeky.ai
- **Jaeger**: https://jaeger.zeeky.ai

### Health Checks

```bash
# Check all services
kubectl get pods -n zeeky

# Check service health
curl https://api.zeeky.ai/health

# Check database connectivity
kubectl exec -it postgres-0 -n zeeky -- psql -U zeeky -d zeeky -c "SELECT 1"
```

## Scaling

### Horizontal Pod Autoscaling

```bash
# Enable HPA for kernel service
kubectl autoscale deployment zeeky-kernel -n zeeky --cpu-percent=70 --min=2 --max=10
```

### Database Scaling

```bash
# Scale PostgreSQL read replicas
kubectl scale statefulset postgres-replica -n zeeky --replicas=3
```

## Security

### Network Policies

```bash
# Apply network policies
kubectl apply -f infra/k8s/security/network-policies.yaml
```

### RBAC

```bash
# Apply RBAC configurations
kubectl apply -f infra/k8s/security/rbac.yaml
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
kubectl exec -it postgres-0 -n zeeky -- pg_dump -U zeeky zeeky > backup.sql

# Restore from backup
kubectl exec -i postgres-0 -n zeeky -- psql -U zeeky zeeky < backup.sql
```

### Application Backup

```bash
# Backup application data
kubectl exec -it minio-0 -n zeeky -- mc mirror /data s3://backups/$(date +%Y%m%d)
```

## Troubleshooting

### Common Issues

1. **Pod not starting**:
   ```bash
   kubectl describe pod <pod-name> -n zeeky
   kubectl logs <pod-name> -n zeeky
   ```

2. **Service not accessible**:
   ```bash
   kubectl get endpoints -n zeeky
   kubectl get ingress -n zeeky
   ```

3. **Database connection issues**:
   ```bash
   kubectl exec -it postgres-0 -n zeeky -- pg_isready -U zeeky
   ```

### Logs

```bash
# View all logs
kubectl logs -l app=zeeky -n zeeky --tail=100

# Follow logs
kubectl logs -f deployment/zeeky-kernel -n zeeky
```

## Contributing

1. Make changes to infrastructure files
2. Test in development environment
3. Update documentation
4. Submit pull request

## License

MIT License - see LICENSE file for details