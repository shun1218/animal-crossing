const models = require('../models/index');

exports.findByUserId = async function (userId) {
  const currentArts = await models.UserArt.findAll({
    attributes: ['art_id'],
    where: {
      user_id: userId
    }
  });
  let arts = [];
  if (!currentArts) {
    return arts;
  }
  for (let art of currentArts) {
    arts.push(art.dataValues.art_id);
  }
  return arts;
}

exports.create = async function (userId, artIds) {
  let objects = [];
  for (let artId of artIds) {
    let object = {
      user_id: userId,
      art_id: artId
    };
    objects.push(object);
  }
  const userArts = await models.UserArt.bulkCreate(objects);
  return userArts;
}

exports.delete = async function (userId, artIds) {
  await models.UserArt.destroy({
    where: {
      user_id: userId,
      art_id: artIds
    }
  });
  return;
}

exports.sync = async function (userId, artIds) {
  const currentArts = await models.UserArt.findAll({
    attributes: ['art_id'],
    where: {
      user_id: userId
    }
  });
  let arts = [];
  for (let art of currentArts) {
    arts.push(art.dataValues.art_id);
  }
  let objects = [];
  for (let artId of artIds) {
    if (!arts.includes(artId)) {
      let object = {
        user_id: userId,
        art_id: artId
      };
      objects.push(object);
    }
  }
  if (objects.length > 0) {
    await models.UserArt.bulkCreate(objects);
  }
  return;
}
