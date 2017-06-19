# Node image processing API [![Circle CI](https://circleci.com/gh/rickydunlop/node-image-processing-api.svg?style=svg)](https://circleci.com/gh/rickydunlop/node-image-processing-api)

## Description
Node image processing API using :

 - Koa 2
 - Mongodb + Mongoose
 - Sharp

## Running

### Using Docker

    docker-compose up

Depending on what version of Docker you are using the app will be available on either
[http://localhost:3000](http://localhost:3000) or [http://192.168.99.100:3000/](http://192.168.99.100:3000/)

### Running locally

Install dependencies


    npm install


Start a Local Server

	npm start


Run Tests

	npm test


Building and Running Production Server

	npm run prod


**Note : Please make sure MongoDB is running before using ```npm start``` or ```npm run prod```**
