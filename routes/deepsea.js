"use strict";

var express = require('express');
var router = express.Router();
const authentication = require('./authentication');
require('dotenv').config();
const fs = require('fs');
const UserDeepSeaCreatureRepository = require('../repositories/user_deep_sea_creature.repository');

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
  let currentDeepSeaCreatures = req.session.passport.user.deepSeaCreatures;
  let inserts = deepSeaCreatures.filter(item =>
    !currentDeepSeaCreatures.includes(item)  
  );
  let deletes = currentDeepSeaCreatures.filter(item =>
    !deepSeaCreatures.includes(item)
  );
  if (inserts.length > 0) {
    await UserDeepSeaCreatureRepository.create(user.userId, inserts);
  }
  if (deletes.length > 0) {
    await UserDeepSeaCreatureRepository.delete(user.userId, deletes);
  }
  req.session.passport.user.deepSeaCreatures = deepSeaCreatures;
  return res.status(200).send({ message: '保存しました。' });
});

module.exports = router;
