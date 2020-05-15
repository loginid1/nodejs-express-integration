FROM node:12.14-alpine as build-stage

WORKDIR /app

ADD . ./

RUN npm install

CMD ["npm", "start"]
