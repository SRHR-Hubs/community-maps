# base layer
FROM node:lts-bullseye-slim AS base
RUN apt-get update && apt-get install libssl-dev ca-certificates -y
WORKDIR /app

COPY package.json package-lock.json ./

# development
FROM base as dev
ENV NODE_ENV=development
RUN npm install

COPY . .

# build stage
FROM base as build
ENV NODE_ENV=production
RUN chown -Rh node:node /app
USER node
RUN npm ci

COPY . .
RUN npm run build

# prod deploy
FROM base as prod

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next 
COPY --from=build /app/public /app/public

EXPOSE 3000
CMD npm run start