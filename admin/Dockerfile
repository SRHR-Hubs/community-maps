# base layer
FROM node:lts-bullseye-slim AS base
# Installing libvips-dev for sharp Compatability
RUN apt-get update && apt-get install libvips-dev -y
WORKDIR /app

COPY package.json package-lock.json ./

# development
FROM base as dev
ENV NODE_ENV=development
RUN npm install

COPY . .

EXPOSE 1337