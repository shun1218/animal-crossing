'use strict';

module.exports = class Authentication {
  getUser(req) {
    let user = null;
    if (typeof req.session.passport !== 'undefined') {
      user = req.session.passport.user;
    }
    return user;
  }
}