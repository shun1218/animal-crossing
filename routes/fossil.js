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
  let standAloneFossils = [];
  let multiPartFossils = [];
  let user = new authentication().getUser(req);
  const client = await mongoClient.connect(url, connectOption);
  const dbName = await client.db('items');
  const fossils = await dbName.collection('fossils').find().toArray();
  for (let i = 0; i < fossils.length; i++) {
    if (fossils[i].type === 'stand-alone') {
      standAloneFossils.push(fossils[i]);
    } else if (fossils[i].type === 'multi-part') {
      multiPartFossils.push(fossils[i]);
    }
  }
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
