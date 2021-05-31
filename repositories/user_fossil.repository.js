const models = require('../models/index');

exports.findByUserId = async function (userId) {
  const currentFossils = await models.UserFossil.findAll({
    attributes: ['fossil_id'],
    where: {
      user_id: userId
    }
  });
  let fossils = [];
  if (!currentFossils) {
    return fossils;
  }
  for (let fossil of currentFossils) {
    fossils.push(fossil.dataValues.fossil_id);
  }
  return fossils;
}

exports.create = async function (userId, fossilIds) {
  let objects = [];
  for (let fossilId of fossilIds) {
    let object = {
      user_id: userId,
      fossil_id: fossilId
    };
    objects.push(object);
  }
  const userFossils = await models.UserFossil.bulkCreate(objects);
  return userFossils;
}

exports.delete = async function (userId, fossilIds) {
  await models.UserFossil.destroy({
    where: {
      user_id: userId,
      fossil_id: fossilIds
    }
  });
  return;
}

exports.sync = async function (userId, fossilIds) {
  const currentFossils = await models.UserFossil.findAll({
    attributes: ['fossil_id'],
    where: {
      user_id: userId
    }
  });
  let fossils = [];
  for (let fossil of currentFossils) {
    fossils.push(fossil.dataValues.fossil_id);
  }
  let objects = [];
  for (let fossilId of fossilIds) {
    if (!fossils.includes(fossilId)) {
      let object = {
        user_id: userId,
        fossil_id: fossilId
      };
      objects.push(object);
    }
  }
  if (objects.length > 0) {
    await models.UserFossil.bulkCreate(objects);
  }
  return;
}
