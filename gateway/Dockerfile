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

RUN echo “deb http://cdn-fastly.deb.debian.org/debian 26 stable main” > /etc/apt/sources.list
RUN echo “deb http://cdn-fastly.deb.debian.org/debian-security 11 stable/updates main” > /etc/apt/sources.list

RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb 

# ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/src/ ./src/

CMD ["yarn", "start:prod"]