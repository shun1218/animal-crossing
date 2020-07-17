"use strict";

var express = require('express');
var router = express.Router();
const authentication = require('./authentication');
const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const fs = require('fs');

const url = process.env.MONGODB_URL;
const connectOption = {
  useUnifiedTopology: true
};

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user = new authentication().getUser(req);
  const deepSeaCreatures = JSON.parse(fs.readFileSync('./json/deep-sea_creature.json', 'utf-8'));
  return res.render('deepsea', { title: 'あつまれどうぶつの森 チェックリスト', deepSeaCreatures, user });
});

router.post('/update', async function(req, res, next) {
  let user = new authentication().getUser(req);
  if (!user) {
    return res.status(401).send({ error: 'ログインしてください。' });
  }
  let deepSeaCreatures = [];
  if (req.body['deepSeaCreatures[]']) {
    if (Array.isArray(req.body['deepSeaCreatures[]'])) {
      req.body['deepSeaCreatures[]'].forEach(value => {
        deepSeaCreatures.push(Number(value));
      });
    } else {
      deepSeaCreatures.push(Number(req.body['deepSeaCreatures[]']));
    }
  }
  const client = await mongoClient.connect(url, connectOption);
  const dbName = await client.db('items');
  const results = await dbName.collection('users').updateOne({'user_id': user.id}, {$set: {'deepSeaCreatures': deepSeaCreatures}});
  req.session.passport.user.deepSeaCreatures = deepSeaCreatures;
  return res.status(200).send({ message: '保存しました。' });
});

module.exports = router;
