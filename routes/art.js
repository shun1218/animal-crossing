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
  const paintings = JSON.parse(fs.readFileSync('./json/painting.json', 'utf-8'));
  const sculptures = JSON.parse(fs.readFileSync('./json/sculpture.json', 'utf-8'));
  return res.render('art', { title: 'あつまれどうぶつの森 チェックリスト', paintings, sculptures, user });
});

router.post('/update', async function(req, res, next) {
  let user = new authentication().getUser(req);
  if (!user) {
    return res.status(401).send({ error: 'ログインしてください。' });
  }
  let arts = [];
  if (req.body['arts[]']) {
    if (Array.isArray(req.body['arts[]'])) {
      req.body['arts[]'].forEach(value => {
        arts.push(Number(value));
      });
    } else {
      arts.push(Number(req.body['arts[]']));
    }
  }
  const client = await mongoClient.connect(url, connectOption);
  const dbName = await client.db('items');
  const results = await dbName.collection('users').updateOne({'user_id': user.id}, {$set: {'arts': arts}});
  req.session.passport.user.arts = arts;
  return res.status(200).send({ message: '保存しました。' });
});

module.exports = router;
