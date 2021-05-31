'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    twitter_id: DataTypes.STRING,
    hemisphere: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    underscored: true
  });
  User.associate = function(models) {
    User.hasMany(models.UserBug, {
      foreignKey: 'user_id'
    });
    User.hasMany(models.UserFish, {
      foreignKey: 'user_id'
    });
    User.hasMany(models.UserFossil, {
      foreignKey: 'user_id'
    });
    User.hasMany(models.UserArt, {
      foreignKey: 'user_id'
    });
    User.hasMany(models.UserDeepSeaCreature, {
      foreignKey: 'user_id'
    });
  }
  return User;
};