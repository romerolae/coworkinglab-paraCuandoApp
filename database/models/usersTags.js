'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UsersTags extends Model {
    static associate(models) {
      UsersTags.belongsTo(models.Tags, {
        as: 'tag',
        foreignKey: 'tag_id',
      })
      UsersTags.belongsTo(models.Users, {
        as: 'interests',
        foreignKey: 'user_id',
      })
    }
  }
  UsersTags.init(
    {
      tag_id: { type: DataTypes.INTEGER, primaryKey: true },
      user_id: { type: DataTypes.UUID, primaryKey: true },
    },
    {
      sequelize,
      modelName: 'UsersTags',
      tableName: 'users_tags',
      underscored: true,
      timestamps: true,
    }
  )
  return UsersTags
}
