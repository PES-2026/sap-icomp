# The default environment will be develop, and we have three differents: development, test and production
ENVIRONMENT?=development
ENV_FILE=.env

# Paths to each compose folders, complement with the file
BASE_PATH=./docker/${ENVIRONMENT}

start-database:
	@echo "Starting database on $(ENVIRONMENT) environment..."
	docker compose -f $(BASE_PATH)/postgres-compose.yml --env-file $(ENV_FILE) down
	docker compose -f $(BASE_PATH)/postgres-compose.yml --env-file $(ENV_FILE) up -d
	@echo "Database on $(ENVIRONMENT) environment started!"

start-backend:
	@echo "Starting backend on $(ENVIRONMENT) environment..."
	docker compose -f $(BASE_PATH)/backend-compose.yml --env-file $(ENV_FILE) down
	docker compose -f $(BASE_PATH)/backend-compose.yml --env-file $(ENV_FILE) up -d
	@echo "Backend on $(ENVIRONMENT) environment started!"

start-frontend:
	@echo "Starting frontend on $(ENVIRONMENT) environment..."
	docker compose -f $(BASE_PATH)/frontend-compose.yml --env-file $(ENV_FILE) down
	docker compose -f $(BASE_PATH)/frontend-compose.yml --env-file $(ENV_FILE) up -d
	@echo "Frontend on $(ENVIRONMENT) environment started!"

start-application:
	@echo "Starting application on $(ENVIRONMENT) environment..."
	make start-database
	# make start-backend
	# make start-frontend
	@echo "Application on $(ENVIRONMENT) environment started!"