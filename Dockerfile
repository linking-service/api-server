FROM node:carbon

MAINTAINER Shuffle

RUN mkdir -p /app

WORKDIR /app

COPY ./ /app

RUN npm install

CMD npm start
