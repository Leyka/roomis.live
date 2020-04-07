FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .
RUN yarn
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
