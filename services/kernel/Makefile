.PHONY: help install dev test lint format clean docker-build docker-run

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pip install -r requirements.txt

dev: ## Run development server
	uvicorn main:app --reload --host 0.0.0.0 --port 8000

test: ## Run tests
	pytest tests/ -v

lint: ## Run linting
	flake8 .
	black --check .
	isort --check-only .

format: ## Format code
	black .
	isort .

clean: ## Clean cache files
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +

docker-build: ## Build Docker image
	docker build -t zeeky-kernel .

docker-run: ## Run Docker container
	docker run -p 8000:8000 zeeky-kernel