FROM node:14.17.5-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm install typescript sequelize mysql2
COPY . .

EXPOSE 5000
CMD [ "npm", "start" ]