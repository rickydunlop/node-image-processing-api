FROM node:8.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN yarn
COPY src /usr/src/app/src
COPY public /usr/src/app/public

EXPOSE 3000

CMD [ "npm", "start" ]
