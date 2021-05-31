"use strict";

var express = require('express');
var router = express.Router();
let passport = require('passport');
const authentication = require('./authentication');
require('dotenv').config();
const UserRepository = require('../repositories/user.repository');

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = new authentication().getUser(req);
  res.render('index', { title: 'あつまれどうぶつの森 チェックリスト', user });
});

router.post('/update', async function(req, res, next) {
  let user = new authentication().getUser(req);
  if (!user) {
    return res.status(401).send({ error: 'ログインしてください。' });
  }
  await UserRepository.updateHemisphere(user.userId, req.body.hemisphere);
  req.session.passport.user.hemisphere = req.body.hemisphere;
  return res.status(200).send({ message: '保存しました。' });
});

router.get('/login', passport.authenticate('twitter'));

router.get('/login/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' }));

module.exports = router;
