# base layer
FROM node:lts-bullseye-slim AS base
RUN apt-get update && apt-get install libssl-dev ca-certificates -y
WORKDIR /app

# ARG CLOUDINARY_CLOUD_NAME
# ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
# ARG CLOUDINARY_API_KEY
# ARG CLOUDINARY_API_SECRET

COPY package.json package-lock.json ./

RUN npm install -g npm@9.4.2

# build stage
FROM base as build
WORKDIR /app
RUN npm ci --only-production

COPY . .
RUN npm run build

# prod deploy
FROM base as prod
WORKDIR /app
ENV NODE_ENV=production

# RUN groupadd -g 1001 -S node
# RUN useradd -u 1001 -S nextjs

COPY --from=build --chown=nextjs:node /app/package.json /app/package-lock.json ./
COPY --from=build --chown=nextjs:node /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:node /app/public ./public
COPY --from=build --chown=nextjs:node /app/.next ./.next 
COPY --from=build --chown=nextjs:node /app/next.config.js ./

USER nextjs:node

EXPOSE 3000
CMD npm run start