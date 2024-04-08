# syntax=docker/dockerfile:1

# --------------------------------------------------------------------

FROM node:20-alpine3.18 AS BUILD_IMAGE

ENV NODE_ENV production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

# --------------------------------------------------------------------

FROM node:20-alpine3.18

ENV NODE_ENV production
ENV PORT 3000
ENV JWT c565bc45-1818-41f3-be52-2b4d11fe959d

RUN addgroup -g 1001 -S nodejs
RUN adduser -S expressjs -u 1001

WORKDIR /app

COPY --from=BUILD_IMAGE --chown=expressjs:nodejs /app/package.json ./
COPY --from=BUILD_IMAGE --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY .build/src .

USER expressjs

EXPOSE 3000

CMD [ "node", "index.js" ]
