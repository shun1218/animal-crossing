const models = require('../models/index');

exports.findByUserId = async function (userId) {
  const currentDeepSeaCreatures = await models.UserDeepSeaCreature.findAll({
    attributes: ['deep_sea_creature_id'],
    where: {
      user_id: userId
    }
  });
  let deepSeaCreatures = [];
  if (!currentDeepSeaCreatures) {
    return deepSeaCreatures;
  }
  for (let deepSeaCreature of currentDeepSeaCreatures) {
    deepSeaCreatures.push(deepSeaCreature.dataValues.deep_sea_creature_id);
  }
  return deepSeaCreatures;
}

exports.create = async function (userId, deepSeaCreatureIds) {
  let objects = [];
  for (let deepSeaCreatureId of deepSeaCreatureIds) {
    let object = {
      user_id: userId,
      deep_sea_creature_id: deepSeaCreatureId
    };
    objects.push(object);
  }
  const userDeepSeaCreatures = await models.UserDeepSeaCreature.bulkCreate(objects);
  return userDeepSeaCreatures;
}

exports.delete = async function (userId, deepSeaCreatureIds) {
  await models.UserDeepSeaCreature.destroy({
    where: {
      user_id: userId,
      deep_sea_creature_id: deepSeaCreatureIds
    }
  });
  return;
}

exports.sync = async function (userId, deepSeaCreatureIds) {
  const currentDeepSeaCreatures = await models.UserDeepSeaCreature.findAll({
    attributes: ['deep_sea_creature_id'],
    where: {
      user_id: userId
    }
  });
  let deepSeaCreatures = [];
  for (let deepSeaCreature of currentDeepSeaCreatures) {
    deepSeaCreatures.push(deepSeaCreature.dataValues.deep_sea_creature_id);
  }
  let objects = [];
  for (let deepSeaCreatureId of deepSeaCreatureIds) {
    if (!deepSeaCreatures.includes(deepSeaCreatureId)) {
      let object = {
        user_id: userId,
        deep_sea_creature_id: deepSeaCreatureId
      };
      objects.push(object);
    }
  }
  if (objects.length > 0) {
    await models.UserDeepSeaCreature.bulkCreate(objects);
  }
  return;
}
