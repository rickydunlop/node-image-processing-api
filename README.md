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


## Usage

There's a Postman collection included which has info on all the endpoints.

### Get all images

	curl -X GET http://localhost:3000/v1/images
	
### Retrieve a single image

	curl -X GET http://localhost:3000/v1/images/:id

### Authenticate

	curl -X POST \
  		http://localhost:3000/v1/authenticate \
		-H 'cache-control: no-cache' \
  		-H 'content-type: application/x-www-form-urlencoded' \
	  	-d password=bynd

### Upload

	curl -X POST \
		http://localhost:3000/v1/upload \
		-H 'authorization: Bearer <token>' \
		-H 'cache-control: no-cache' \
		-H 'content-type: multipart/form-data' \
		-F image=@__tests__/files/image.png
		
### Delete an image

	curl -X DELETE \
		http://localhost:3000/v1/images/:id \
		-H 'authorization: Bearer <token>' \
		-H 'cache-control: no-cache' \


### Resize an image

	curl -X GET http://localhost:3000/v1/resize/:id/:width/:height
	
### Rotate an image

	curl -X GET http://localhost:3000/v1/rotate/:angle
	
_angle should be a multiple of 90_