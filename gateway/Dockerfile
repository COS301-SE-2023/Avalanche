FROM node:20 as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
COPY ./src ./
RUN yarn

COPY --chown=node:node . .
RUN yarn build

# ---

FROM node:20

USER node
WORKDIR /home/node

# We don't need the standalone Chromium
# ENV NODE_ENV production

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/src/ ./src/

CMD ["yarn", "start:prod"]