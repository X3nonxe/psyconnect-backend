# Path ke file docker-compose
DOCKER_COMPOSE_FILE=./deployments/docker-compose/infrastructure.yaml

# Up semua service secara detached
up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Down semua service
down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

# Down dan hapus volume
down-v:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down -v

# Rebuild dan up ulang
rebuild:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down -v
	docker-compose -f $(DOCKER_COMPOSE_FILE) build
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Tampilkan status container
status:
	docker-compose -f $(DOCKER_COMPOSE_FILE) ps
