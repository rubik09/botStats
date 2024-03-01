FROM node:18.17.1-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --force

COPY . .

RUN npm run build

CMD [ "node", "dist/src/main.js" ]
