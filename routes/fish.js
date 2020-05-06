"use strict";

var express = require('express');
var router = express.Router();
const authentication = require('./authentication');
const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const url = process.env.MONGODB_URL;
const connectOption = {
  useUnifiedTopology: true
};

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user = new authentication().getUser(req);
  const client = await mongoClient.connect(url, connectOption);
  const dbName = await client.db('items');
  const fishes = await dbName.collection('fishes').find().toArray();
  return res.render('fish', { title: 'あつまれどうぶつの森 チェックリスト', fishes, user });
});

router.post('/update', async function(req, res, next) {
  let user = new authentication().getUser(req);
  if (!user) {
    return res.status(401).send({ error: 'ログインしてください。' });
  }
  let fishes = [];
  if (req.body['fishes[]']) {
    if (Array.isArray(req.body['fishes[]'])) {
      req.body['fishes[]'].forEach(value => {
        fishes.push(Number(value));
      });
    } else {
      fishes.push(Number(req.body['fishes[]']));
    }
  }
  const client = await mongoClient.connect(url, connectOption);
  const dbName = await client.db('items');
  const results = await dbName.collection('users').updateOne({'user_id': user.id}, {$set: {'fishes': fishes}});
  req.session.passport.user.fishes = fishes;
  return res.status(200).send({ message: '保存しました。' });
});

module.exports = router;
