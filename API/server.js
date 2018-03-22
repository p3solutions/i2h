const express = require('express');
let path = require('path');
let morgan = require('morgan');
const fs = require('fs');
let rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');
const configs = require('./config');
const app = express();
const http = require('http');
const login = require('./routes/login');
/*
let db;
const mongoDB = require('mongodb');
const mongoClient = mongoDB.MongoClient;
mongoClient.connect(configs.dbConnectionUrl, (err, dbClient) => {
    if (err) return console.log(err);
    db = dbClient.db(configs.dbName);
    // console.log(db);
    app.listen(configs.apiPort, () => {
      console.log(`Listening on port ${configs.apiPort}`);
    });
  });
*/


// ensure log directory exists
if (fs.existsSync(configs.logDirectory))
console.log(`Existing Log folder path: ${configs.logDirectory}`);
else {
    fs.mkdirSync(configs.logDirectory);
    console.log(`Created log file, path: ${configs.logDirectory}`);
}
// create a rotating write stream
let accessLogStream = rfs(configs.logFile, {
    size: '5M', // rotate every 5 MegaBytes written
    interval: '1d', // rotate daily
    // compress: 'gzip', // compress rotated files
    path: configs.logDirectory
});

// setup the logger
app.use(morgan('combined', {
    stream: accessLogStream
}));
// app.use(express.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/login', login);

// Add headers
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', configs.IPallowedForUI);

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   // res.setHeader('Access-Control-Allow-Credentials', true);
//   // Pass to next layer of middleware
//   next();
// });

// // dynamically include routes (Controller)
// fs.readdirSync('./controllers').forEach(function (file) {
//   if (file.substr(-3) == '.js') {
//     route = require('./controllers/' + file);
//     console.log('route->', route);
//     route.controller(app);
//   }
// });

//Import the mongoose module
const mongoose = require('mongoose');
//Set up default mongoose connection
mongoose.connect(configs.dbConnectionUrl);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Define a schema
var Schema = mongoose.Schema;

var userInfoSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  passwordHash: String,
  passwordSalt: String
});


let User = mongoose.model("User", userInfoSchema);

app.post("/addname", (req, res) => {
  // Create an instance of model SomeModel
  const userInstance = new User(req.body);

  userInstance.save()
  .then(item => {
    console.log('item->', item);
    res.send("item saved to database");
  })
  .catch(err => {
    res.status(400).send("unable to save to database");
  });
});


// catch 404 and forward to error handler
app.use(function (req, res) {
  console.log('ERROR 404, URL NOT FOUND');
  res.send('ERROR 404, URL NOT FOUND');
});
// server connection
app.listen(configs.apiPort, () => {
  console.log(`Listening on port ${configs.apiPort}`);
});
module.exports = app;
