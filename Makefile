.PHONY: makemigrations migrate manage binstall finstall audit

ARGS = $(filter-out $@,$(MAKECMDGOALS))
PREFIX = docker-compose exec

BACKEND = $(PREFIX) backend python3
MANAGE = $(BACKEND) manage.py

makemigrations:
	$(MANAGE) makemigrations $(ARGS)

migrate:
	$(MANAGE) migrate $(ARGS)

manage:
	$(MANAGE) $(ARGS)

binstall:
	$(BACKEND) -m pip install $(ARGS)

finstall:
	npm install --prefix frontend $(ARGS)

audit:
	npm audit --prefix frontend $(ARGS)