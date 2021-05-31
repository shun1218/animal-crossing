'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDeepSeaCreature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserDeepSeaCreature.init({
    user_id: DataTypes.INTEGER,
    deep_sea_creature_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserDeepSeaCreature',
    underscored: true
  });
  UserDeepSeaCreature.associate = function(models) {
    UserDeepSeaCreature.belongsTo(models.User);
  }
  return UserDeepSeaCreature;
};