'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    static associate(models) {
      Tags.hasMany(models.PublicationsTags, {
        as: 'publications_tags',
        foreignKey: 'tag_id',
      })
      Tags.hasMany(models.UsersTags, { as: 'users_tags', foreignKey: 'tag_id' })
    }
  }
  Tags.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      image_url: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Tags',
      tableName: 'tags',
      underscored: true,
      timestamps: true,
      scopes: {
        view_public: {
          attributes: ['id', 'name', 'description', 'image_url'],
        },
        no_timestamps: {
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
      },
    }
  )
  return Tags
}
