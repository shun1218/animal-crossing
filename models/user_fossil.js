'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFossil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserFossil.init({
    user_id: DataTypes.INTEGER,
    fossil_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserFossil',
    underscored: true
  });
  UserFossil.associate = function(models) {
    UserFossil.belongsTo(models.User);
  }
  return UserFossil;
};