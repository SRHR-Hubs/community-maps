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
RUN npm ci --only-production

# build stage
FROM base as build
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npm run build

# prod deploy
FROM base as prod
ENV NODE_ENV=production
WORKDIR /app

RUN groupadd -f -g 1001 node
RUN useradd -r -u 1001 -md /home/nextjs -g node nextjs 
RUN chown -R nextjs:node /home/nextjs

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/config ./config
COPY --from=build --chown=nextjs:node /app/.next ./.next 
COPY --from=build --chown=nextjs:node /app/next.config.js ./

USER nextjs

EXPOSE 3000
CMD npm run start