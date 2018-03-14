# Install MongoDB in the system to run MongoDB server

Install from setup or follow:
https://docs.mongodb.com/tutorials/install-mongodb-on-windows/

## After installing mongodb in the system, start service by executing command  `mongod --dbpath="path/to/the/data/directory"` in the directory of mongodb/bin (where mongod.exe exists)

## Local mongodb service starts & wait for the connection by default at `mongodb://127.0.0.1:27017` 

## Start the api server it will connect the mongodb service.


## If the mongoDB connection fails, API won't start, it is handled in this way.