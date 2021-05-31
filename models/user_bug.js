'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserBug extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserBug.init({
    user_id: DataTypes.INTEGER,
    bug_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserBug',
    underscored: true
  });
  UserBug.associate = function(models) {
    UserBug.belongsTo(models.User);
  }
  return UserBug;
};