"use strict";

var express = require('express');
var router = express.Router();
const authentication = require('./authentication');
require('dotenv').config();
const fs = require('fs');
const UserFossilRepository = require('../repositories/user_fossil.repository');

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
  let currentFossils = req.session.passport.user.fossils;
  let inserts = fossils.filter(item =>
    !currentFossils.includes(item)  
  );
  let deletes = currentFossils.filter(item =>
    !fossils.includes(item)
  );
  if (inserts.length > 0) {
    await UserFossilRepository.create(user.userId, inserts);
  }
  if (deletes.length > 0) {
    await UserFossilRepository.delete(user.userId, deletes);
  }
  req.session.passport.user.fossils = fossils;
  return res.status(200).send({ message: '保存しました。' });
});

module.exports = router;
