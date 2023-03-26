'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Votes extends Model {
    static associate(models) {
      Votes.belongsTo(models.Users, {
        as: 'user',
        foreignKey: 'user_id',
      })
      Votes.belongsTo(models.Publications, {
        as: 'publication',
        foreignKey: 'publication_id',
      })
    }
  }
  Votes.init(
    {
      user_id: { type: DataTypes.UUID, primaryKey: true },
      publication_id: { type: DataTypes.UUID, primaryKey: true },
    },
    {
      sequelize,
      modelName: 'Votes',
      tableName: 'votes',
      underscored: true,
      timestamps: true,
    }
  )
  return Votes
}
