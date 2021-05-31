"use strict";

var express = require('express');
var router = express.Router();
const authentication = require('./authentication');
require('dotenv').config();
const fs = require('fs');
const UserFishRepository = require('../repositories/user_fish.repository');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user = new authentication().getUser(req);
  const fishes = JSON.parse(fs.readFileSync('./json/fish.json', 'utf-8'));
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
  let currentFishes = req.session.passport.user.fishes;
  let inserts = fishes.filter(item =>
    !currentFishes.includes(item)  
  );
  let deletes = currentFishes.filter(item =>
    !fishes.includes(item)
  );
  if (inserts.length > 0) {
    await UserFishRepository.create(user.userId, inserts);
  }
  if (deletes.length > 0) {
    await UserFishRepository.delete(user.userId, deletes);
  }
  req.session.passport.user.fishes = fishes;
  return res.status(200).send({ message: '保存しました。' });
});

module.exports = router;
