const models = require('../models/index');
const Sequelize = require('sequelize');

exports.findByTwitterId = async function (twitterId) {
  const user = await models.User.findOne({
    where: {
      twitter_id: twitterId
    }
  });
  return user;
}

exports.create = async function (twitterId) {
  const user = await models.User.create({
    twitter_id: twitterId,
    hemisphere: 'northern'
  });
  return user;
}

exports.updateHemisphere = async function (userId, hemisphere) {
  await models.User.update({
    hemisphere: hemisphere
  }, {
    where: {
      id: userId
    }
  });
}

exports.sync = async function (twitterId, hemisphere) {
  const currentUser = await models.User.findOne({
    where: {
      twitter_id: twitterId
    }
  });
  if (!currentUser) {
    const user = await models.User.create({
      twitter_id: twitterId,
      hemisphere: hemisphere
    });
    return user;
  }
  return false;
}
