"use strict";

var express = require('express');
var router = express.Router();
const authentication = require('./authentication');

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = new authentication().getUser(req);
  res.render('about', { title: 'あつまれどうぶつの森 チェックリスト', user });
});

module.exports = router;
