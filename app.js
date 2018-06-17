var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

//var configDB = require('./config/database.js');
//mongoose.connect(configDB.url);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var mongoPassword = 'spuncle78';
			
var http = require('http');
var server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

var config = JSON.parse(process.env.APP_CONFIG);
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(
  "mongodb://" + config.mongo.user + ":" + encodeURIComponent(mongoPassword) + "@" + 
  config.mongo.hostString, 
  function(err, db) {
    if(!err) {
      res.end("We are connected to MongoDB");
    } else {
      res.end("Error while connecting to MongoDB");
    }
  }
);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  secret: 'shhsecret',
  resave: true,
  saveUninitialized: true

})); 


app.use(passport.initialize());  
app.use(passport.session());  
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);

require('./config/passport')(passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
