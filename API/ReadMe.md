# NOTES
First start mongoDB service, then start node server & then start angular server.


# Install MongoDB in the system to run MongoDB server

## install from setup of follow: https://docs.mongodb.com/tutorials/install-mongodb-on-windows/

## After installing mongodb in the system, start service by executing command  `mongod --dbpath="path/to/the/data/directory"` in the directory of mongodb/bin (where mongod.exe exists)

## Local mongodb service starts & wait for the connection by default at `mongodb://127.0.0.1:27017` 

## Start the api server it will connect the mongodb service.

# PORTS used
1. mongodb use 27017
2. server-side node-app use 3000 
3. angular web-app use 4200


# REFERENCES
1. https://zellwk.com/blog/crud-express-mongodb/
2. https://docs.mongodb.com/tutorials/install-mongodb-on-windows/
3. https://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html
4. https://www.djamware.com/post/5a0673c880aca7739224ee21/mean-stack-angular-5-crud-web-application-example