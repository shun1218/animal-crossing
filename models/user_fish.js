'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserFish.init({
    user_id: DataTypes.INTEGER,
    fish_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserFish',
    underscored: true
  });
  UserFish.associate = function(models) {
    UserFish.belongsTo(models.User);
  }
  return UserFish;
};