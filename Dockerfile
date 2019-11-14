FROM node:carbon

MAINTAINER Shuffle

RUN mkdir -p /app

WORKDIR /app

COPY ./ /app

RUN npm install

ENV NODE_ENV=production

CMD npm start
