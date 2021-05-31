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
require('dotenv').config();
const UserRepository = require('./repositories/user.repository');
const UserBugRepository = require('./repositories/user_bug.repository');
const UserFishRepository = require('./repositories/user_fish.repository');
const UserFossilRepository = require('./repositories/user_fossil.repository');
const UserArtRepository = require('./repositories/user_art.repository');
const UserDeepSeaCreatureRepository = require('./repositories/user_deep_sea_creature.repository');

let indexRouter = require('./routes/index');
let bugRouter = require('./routes/bug');
let fishRouter = require('./routes/fish');
let fossilRouter = require('./routes/fossil');
let artRouter = require('./routes/art');
let deepseaRouter = require('./routes/deepsea');
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
  callbackURL: config.callbackUrl
},
async function(token, tokenSecret, profile, done) {
  let user = profile;
  let userInDb = await UserRepository.findByTwitterId(user.id);
  if (!userInDb) {
    userInDb = await UserRepository.create(user.id);
  }
  user.userId = userInDb.dataValues.id;
  user.hemisphere = userInDb.dataValues.hemisphere;
  user.bugs = await UserBugRepository.findByUserId(userInDb.dataValues.id);
  user.fishes = await UserFishRepository.findByUserId(userInDb.dataValues.id);
  user.fossils = await UserFossilRepository.findByUserId(userInDb.dataValues.id);
  user.arts = await UserArtRepository.findByUserId(userInDb.dataValues.id);
  user.deepSeaCreatures = await UserDeepSeaCreatureRepository.findByUserId(userInDb.dataValues.id);
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
app.use('/deepsea', deepseaRouter);
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
