"use strict";

var express = require('express');
var router = express.Router();
const authentication = require('./authentication');
require('dotenv').config();
const fs = require('fs');
const UserArtRepository = require('../repositories/user_art.repository');

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
  let currentArts = req.session.passport.user.arts;
  let inserts = arts.filter(item =>
    !currentArts.includes(item)  
  );
  let deletes = currentArts.filter(item =>
    !arts.includes(item)
  );
  if (inserts.length > 0) {
    await UserArtRepository.create(user.userId, inserts);
  }
  if (deletes.length > 0) {
    await UserArtRepository.delete(user.userId, deletes);
  }
  req.session.passport.user.arts = arts;
  return res.status(200).send({ message: '保存しました。' });
});

module.exports = router;
