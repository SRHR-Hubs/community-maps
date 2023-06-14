# base layer
FROM node:lts-bullseye-slim AS base
RUN apt-get update && apt-get install \
    libssl-dev ca-certificates \
    libjemalloc2 \
    -y
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g npm@9.4.2
RUN npm ci --only-production

# build stage
FROM base as build
WORKDIR /app

ARG API_HOST
ENV API_HOST=$API_HOST

ARG CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME

ARG CLOUDINARY_API_KEY
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY

ARG NEXT_PUBLIC_HOST
ENV NEXT_PUBLIC_HOST=$NEXT_PUBLIC_HOST

ARG NEXT_PUBLIC_MEILISEARCH_HOST
ENV NEXT_PUBLIC_MEILISEARCH_HOST=$NEXT_PUBLIC_MEILISEARCH_HOST

ARG NEXT_PUBLIC_MEILISEARCH_KEY
ENV NEXT_PUBLIC_MEILISEARCH_KEY=$NEXT_PUBLIC_MEILISEARCH_KEY

ARG NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN

ARG NEXT_PUBLIC_COGNITO_KEY
ENV NEXT_PUBLIC_COGNITO_KEY=$NEXT_PUBLIC_COGNITO_KEY

COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npm run build

# prod deploy
FROM base as prod
ENV NODE_ENV=production

ENV NODE_OPTIONS='--max-old-space-size=1024'
ENV LD_PRELOAD='/usr/lib/x86_64-linux-gnu/libjemalloc.so.2'

WORKDIR /app

RUN groupadd -f -g 1001 node
RUN useradd -r -u 1001 -md /home/nextjs -g node nextjs 
RUN chown -R nextjs:node /home/nextjs

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/config ./config
COPY --from=build /app/.env* ./
COPY --from=build --chown=nextjs:node /app/.next ./.next 
COPY --from=build --chown=nextjs:node /app/next.config.js ./

USER nextjs

EXPOSE 3000
CMD npm run start