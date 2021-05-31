const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const UserRepository = require('../repositories/user.repository');
const UserBugRepository = require('../repositories/user_bug.repository');
const UserFishRepository = require('../repositories/user_fish.repository');
const UserFossilRepository = require('../repositories/user_fossil.repository');
const UserArtRepository = require('../repositories/user_art.repository');
const UserDeepSeaCreatureRepository = require('../repositories/user_deep_sea_creature.repository');

const url = process.env.MONGODB_URL;
const connectOption = {
  useUnifiedTopology: true
};

mongoClient.connect(url, connectOption, function (err, client) {
  const dbName = client.db('items');
  dbName.collection('users').find({}).toArray(async function (err, users) {
    for (let user of users) {
      console.log(user);
      let userData = await UserRepository.sync(user.user_id, user.hemisphere);
      if (!userData) {
        userData = await UserRepository.findByTwitterId(user.user_id);
      }
      if (user.bugs) {
        await UserBugRepository.sync(userData.dataValues.id, user.bugs);
      }
      if (user.fishes) {
        await UserFishRepository.sync(userData.dataValues.id, user.fishes);
      }
      if (user.fossils) {
        await UserFossilRepository.sync(userData.dataValues.id, user.fossils);
      }
      if (user.arts) {
        await UserArtRepository.sync(userData.dataValues.id, user.arts);
      }
      if (user.deepSeaCreatures) {
        await UserDeepSeaCreatureRepository.sync(userData.dataValues.id, user.deepSeaCreatures);
      }
    }
    console.log(users.length);
  });
  return;
});
