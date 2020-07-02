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
  const bugs = JSON.parse(fs.readFileSync('./json/bug.json', 'utf-8'));
  return res.render('bug', { title: 'あつまれどうぶつの森 チェックリスト', bugs, user });
});

router.post('/update', async function(req, res, next) {
  let user = new authentication().getUser(req);
  if (!user) {
    return res.status(401).send({ error: 'ログインしてください。' });
  }
  let bugs = [];
  if (req.body['bugs[]']) {
    if (Array.isArray(req.body['bugs[]'])) {
      req.body['bugs[]'].forEach(value => {
        bugs.push(Number(value));
      });
    } else {
      bugs.push(Number(req.body['bugs[]']));
    }
  }
  const client = await mongoClient.connect(url, connectOption);
  const dbName = await client.db('items');
  const results = await dbName.collection('users').updateOne({'user_id': user.id}, {$set: {'bugs': bugs}});
  req.session.passport.user.bugs = bugs;
  return res.status(200).send({ message: '保存しました。' });
});

module.exports = router;
