'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Publications extends Model {
    static associate(models) {
      Publications.belongsTo(models.Users, {
        as: 'user',
        foreignKey: 'user_id',
      })
      Publications.belongsTo(models.Cities, {
        as: 'city',
        foreignKey: 'city_id',
      })
      Publications.belongsTo(models.PublicationTypes, {
        as: 'publication_type',
        foreignKey: 'publication_type_id',
      })
      Publications.belongsToMany(models.Votes, {
        through: 'votes',
        foreignKey: 'publication_id',
      })
      Publications.belongsToMany(models.Tags, {
        through: 'publications_tags',
        as: 'tags',
        foreignKey: 'publication_id',
      })
      Publications.hasMany(models.PublicationsImages, {
        as: 'images',
        foreignKey: 'publication_id',
      })
    }
  }
  Publications.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      content: DataTypes.TEXT,
      reference_link: DataTypes.TEXT,
      city_id: DataTypes.INTEGER,
      user_id: DataTypes.UUID,
      publication_type_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Publications',
      tableName: 'publications',
      underscored: true,
      timestamps: true,
      scopes: {
        no_timestamps: {
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
      },
    }
  )
  return Publications
}
