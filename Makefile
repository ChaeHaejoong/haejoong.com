COMPOSE := docker compose \
	-f docker-compose.infra.yaml \
	-f docker-compose.app.yaml

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down
