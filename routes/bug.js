"use strict";

var express = require('express');
var router = express.Router();
const authentication = require('./authentication');
require('dotenv').config();
const fs = require('fs');
const UserBugRepository = require('../repositories/user_bug.repository');

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
  let currentBugs = req.session.passport.user.bugs;
  let inserts = bugs.filter(item =>
    !currentBugs.includes(item)  
  );
  let deletes = currentBugs.filter(item =>
    !bugs.includes(item)
  );
  if (inserts.length > 0) {
    await UserBugRepository.create(user.userId, inserts);
  }
  if (deletes.length > 0) {
    await UserBugRepository.delete(user.userId, deletes);
  }
  req.session.passport.user.bugs = bugs;
  return res.status(200).send({ message: '保存しました。' });
});

module.exports = router;
