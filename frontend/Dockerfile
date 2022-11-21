# base layer
FROM node:lts-bullseye-slim AS base
RUN apt-get update && apt-get install libssl-dev ca-certificates -y
WORKDIR /app

ARG CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET

COPY package.json package-lock.json ./

RUN npm install -g npm@9.1.2

# build stage
FROM base as build
ENV NODE_ENV=production
RUN npm ci

COPY . .
RUN npm run build

# prod deploy
FROM base as prod

COPY --from=build /app/next.config.js ./
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next 
COPY --from=build /app/public /app/public

EXPOSE 3000
CMD npm run start