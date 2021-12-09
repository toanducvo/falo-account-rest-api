FROM node:latest

WORKDIR /app

COPY package.json /app

RUN yarn install

COPY . /app

EXPOSE 5000

CMD yarn start
