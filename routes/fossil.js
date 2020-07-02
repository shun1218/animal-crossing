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
  const standAloneFossils = JSON.parse(fs.readFileSync('./json/fossil_stand_alone.json', 'utf-8'));
  const multiPartFossils = JSON.parse(fs.readFileSync('./json/fossil_multi_part.json', 'utf-8'));
  return res.render('fossil', { title: 'あつまれどうぶつの森 チェックリスト', standAloneFossils, multiPartFossils, user });
});

router.post('/update', async function(req, res, next) {
  let user = new authentication().getUser(req);
  if (!user) {
    return res.status(401).send({ error: 'ログインしてください。' });
  }
  let fossils = [];
  if (req.body['fossils[]']) {
    if (Array.isArray(req.body['fossils[]'])) {
      req.body['fossils[]'].forEach(value => {
        fossils.push(Number(value));
      });
    } else {
      fossils.push(Number(req.body['fossils[]']));
    }
  }
  const client = await mongoClient.connect(url, connectOption);
  const dbName = await client.db('items');
  const results = await dbName.collection('users').updateOne({'user_id': user.id}, {$set: {'fossils': fossils}});
  req.session.passport.user.fossils = fossils;
  return res.status(200).send({ message: '保存しました。' });
});

module.exports = router;
