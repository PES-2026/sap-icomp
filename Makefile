-include .env

# The default environment will be develop, and we have three differents: develop, test and production
ENVIRONMENT?=develop
ENV_FILE=.env

# Paths to each compose folders, complement with the file
BASE_PATH=./docker/${ENVIRONMENT}

build-backend:
	@echo "Building backend for $(ENVIRONMENT) environment..."
	docker build \
              -t sap-icomp-backend-$(ENVIRONMENT):latest \
              -f ./backend/Dockerfile.$(ENVIRONMENT) \
              ./backend
	@echo "Backend for $(ENVIRONMENT) environment built!"

build-frontend:
	@echo "Building frontend for $(ENVIRONMENT) environment..."
	
	docker build \
              --build-arg NEXT_PUBLIC_API_URL=http://localhost:8107 \
              -t sap-icomp-frontend-$(ENVIRONMENT):latest \
              -f ./frontend/Dockerfile.$(ENVIRONMENT) \
              ./frontend

	
	@echo "Frontend for $(ENVIRONMENT) environment built!"

compose:
	@echo "Starting application on $(ENVIRONMENT) environment..."
	
	docker compose \
              -f $(BASE_PATH)/docker-compose.yml \
              --env-file $(ENV_FILE) \
              down
	
	docker compose \
              -f $(BASE_PATH)/docker-compose.yml \
              --env-file $(ENV_FILE) \
              up -d

	@echo "Application on $(ENVIRONMENT) environment started!"

start-application:
	@echo "Starting application on $(ENVIRONMENT) environment..."
	make build-backend
	make build-frontend
	make compose
	@echo "Application on $(ENVIRONMENT) environment started!"