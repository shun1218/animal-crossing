const models = require('../models/index');

exports.findByUserId = async function (userId) {
  const currentBugs = await models.UserBug.findAll({
    attributes: ['bug_id'],
    where: {
      user_id: userId
    }
  });
  let bugs = [];
  if (!currentBugs) {
    return bugs;
  }
  for (let bug of currentBugs) {
    bugs.push(bug.dataValues.bug_id);
  }
  return bugs;
}

exports.create = async function (userId, bugIds) {
  let objects = [];
  for (let bugId of bugIds) {
    let object = {
      user_id: userId,
      bug_id: bugId
    };
    objects.push(object);
  }
  const userBugs = await models.UserBug.bulkCreate(objects);
  return userBugs;
}

exports.delete = async function (userId, bugIds) {
  await models.UserBug.destroy({
    where: {
      user_id: userId,
      bug_id: bugIds
    }
  });
  return;
}

exports.sync = async function (userId, bugIds) {
  const currentBugs = await models.UserBug.findAll({
    attributes: ['bug_id'],
    where: {
      user_id: userId
    }
  });
  let bugs = [];
  for (let bug of currentBugs) {
    bugs.push(bug.dataValues.bug_id);
  }
  let objects = [];
  for (let bugId of bugIds) {
    if (!bugs.includes(bugId)) {
      let object = {
        user_id: userId,
        bug_id: bugId
      };
      objects.push(object);
    }
  }
  if (objects.length > 0) {
    await models.UserBug.bulkCreate(objects);
  }
  return;
}
