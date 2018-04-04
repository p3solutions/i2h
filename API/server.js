// To clear the previous content of the terminal 
// console.reset = function () {
//   return process.stdout.write('\033c');
// }
// console.reset();

const express = require('express'),
      path = require('path'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      configs = require('./config/config'),
      http = require('http'),
      cookieParser = require('cookie-parser'),
      cors = require('cors'),
// [SH] Require Passport
      passport = require('passport');
// [SH] Bring in the data model
require('./models/db');
// [SH] Bring in the Passport config after model is defined
require('./config/passport');
// [SH] Bring in the routes for the API (delete the default routes)
const routesApi = require('./routes/index');

const app = express();

// setup the http req logger
app.use(morgan(`:remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`, {
  stream: configs.accessLogStream
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(express.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add headers
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // allow all origin to access
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
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

app.use(cookieParser());
app.use(cors());

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

// [SH] Use the API routes when path starts with /api
app.use('/', routesApi);

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  console.log('URL NOT FOUND OR SOMETHING WENT WRONG', err);
  res.send('URL NOT FOUND OR SOMETHING WENT WRONG');
});

if (app.get('env') === 'development') {
  // development error handler will print stacktrace
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  // server connection
    app.listen(configs.apiPort, configs.devPvtIP, () => {
      console.log(`Dev env\nListening on ${configs.devPvtIP} : ${configs.apiPort}`);
    });
  });
} else if (app.get('env') === 'production') {
  // production error handler no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
  // server connection
  // app.listen(configs.apiPort, () => {
  //   console.log(`Local Env\nListening on port ${configs.apiPort}`);
  // });
} else {
  app.listen(configs.apiPort, () => {
    console.log(`Local Env\nListening on port ${configs.apiPort}`);
  });
}

module.exports = app;
