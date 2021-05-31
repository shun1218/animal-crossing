'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserArt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserArt.init({
    user_id: DataTypes.INTEGER,
    art_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserArt',
    underscored: true
  });
  UserArt.associate = function(models) {
    UserArt.belongsTo(models.User);
  }
  return UserArt;
};