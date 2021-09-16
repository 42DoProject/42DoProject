FROM --platform=linux/amd64 node:14.17.5-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# RUN apk add alpine-sdk
RUN npm install
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
