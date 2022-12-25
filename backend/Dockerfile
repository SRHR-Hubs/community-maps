
FROM python:3.11-slim-bullseye

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt /src/
WORKDIR /src

RUN pip3 install -r requirements.txt
COPY . /src/