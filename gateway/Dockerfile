FROM node:20-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
COPY ./src ./
RUN yarn

COPY --chown=node:node . .
RUN yarn build

# ---

FROM node:20-alpine
# Installing Chrone
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -

RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >>/etc/apt/sources.list.d/google-chrome.list'

RUN apt-get -y update

RUN apt-get install -y google-chrome-stable

# install chromedriver

RUN apt-get install -yqq unzip

RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip

RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/

# set display port to avoid crash

ENV DISPLAY=:99

# ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/src/ ./src/

CMD ["yarn", "start:prod"]