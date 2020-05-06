"use strict";

var express = require('express');
var router = express.Router();
let passport = require('passport');
const authentication = require('./authentication');
const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const url = process.env.MONGODB_URL;
const connectOption = {
  useUnifiedTopology: true
};

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
  const client = await mongoClient.connect(url, connectOption);
  const dbName = await client.db('items');
  const results = await dbName.collection('users').updateOne({'user_id': user.id}, {$set: {'hemisphere': req.body.hemisphere}});
  req.session.passport.user.hemisphere = req.body.hemisphere;
  return res.status(200).send({ message: '保存しました。' });
});

router.get('/login', passport.authenticate('twitter'));

router.get('/login/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' }));

module.exports = router;
