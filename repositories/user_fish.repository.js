const models = require('../models/index');

exports.findByUserId = async function (userId) {
  const currentFishes = await models.UserFish.findAll({
    attributes: ['fish_id'],
    where: {
      user_id: userId
    }
  });
  let fishes = [];
  if (!currentFishes) {
    return fishes;
  }
  for (let fish of currentFishes) {
    fishes.push(fish.dataValues.fish_id);
  }
  return fishes;
}

exports.create = async function (userId, fishIds) {
  let objects = [];
  for (let fishId of fishIds) {
    let object = {
      user_id: userId,
      fish_id: fishId
    };
    objects.push(object);
  }
  const userFishes = await models.UserFish.bulkCreate(objects);
  return userFishes;
}

exports.delete = async function (userId, fishIds) {
  await models.UserFish.destroy({
    where: {
      user_id: userId,
      fish_id: fishIds
    }
  });
  return;
}

exports.sync = async function (userId, fishIds) {
  const currentFishes = await models.UserFish.findAll({
    attributes: ['fish_id'],
    where: {
      user_id: userId
    }
  });
  let fishes = [];
  for (let fish of currentFishes) {
    fishes.push(fish.dataValues.fish_id);
  }
  let objects = [];
  for (let fishId of fishIds) {
    if (!fishes.includes(fishId)) {
      let object = {
        user_id: userId,
        fish_id: fishId
      };
      objects.push(object);
    }
  }
  if (objects.length > 0) {
    await models.UserFish.bulkCreate(objects);
  }
  return;
}
