ARG PYTHON_VERSION=3.10-buster

FROM python:${PYTHON_VERSION} AS base
WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_ENV=production

RUN mkdir -p /code


COPY requirements.txt /tmp/requirements.txt

RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /root/.cache/

FROM base AS prod
WORKDIR /code

COPY . /code/

# RUN python manage.py collectstatic --noinput

EXPOSE 8000

# replace demo.wsgi with <project_name>.wsgi
CMD ["gunicorn", "--bind", "[::]:8000", "--bind", "fly-local-6pn:8000", "--workers", "2", "api.wsgi"]
