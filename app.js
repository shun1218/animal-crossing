"use strict";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let config = require('config');
let passport = require('passport');
let TwitterStrategy = require('passport-twitter').Strategy;
let session = require('express-session');
const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const url = process.env.MONGODB_URL;
const connectOption = {
  useUnifiedTopology: true
};

let indexRouter = require('./routes/index');
let bugRouter = require('./routes/bug');
let fishRouter = require('./routes/fish');
let fossilRouter = require('./routes/fossil');
let artRouter = require('./routes/art');
let aboutRouter = require('./routes/about');
let logoutRouter = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: config.callbackURL
},
async function(token, tokenSecret, profile, done) {
  let user = profile;
  const client = await mongoClient.connect(url, connectOption);
  const dbName = await client.db('items');
  let userData = await dbName.collection('users').findOne({'user_id': user.id});
  if (userData) {
    user.hemisphere = userData.hemisphere;
    user.bugs = userData.bugs;
    user.fishes = userData.fishes;
    if (!userData.fossils) {
      userData.fossils = [];
    }
    if (!userData.arts) {
      userData.arts = [];
    }
    user.fossils = userData.fossils;
    user.arts = userData.arts;
  }
  if (!userData) {
    let result = await dbName.collection('users').insertOne({'user_id': user.id, 'hemisphere': 'northern', 'bugs': [], 'fishes': [], 'fossils': [], 'arts': []});
    user.hemisphere = 'northern';
    user.bugs = [];
    user.fishes = [];
    user.fossils = [];
    user.arts = [];
  }
  return done(null, user);
}
));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxage: 1000 * 60 * 60 * 24 * 7
  }
}));
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use('/', indexRouter);
app.use('/bug', bugRouter);
app.use('/fish', fishRouter);
app.use('/fossil', fossilRouter);
app.use('/art', artRouter);
app.use('/about', aboutRouter);
app.use('/logout', logoutRouter);

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
