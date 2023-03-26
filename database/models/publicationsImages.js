'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PublicationsImages extends Model {
    static associate(models) {
      PublicationsImages.belongsTo(models.Publications, {
        as: 'publication',
        foreignKey: 'publication_id',
      })
    }
  }
  PublicationsImages.init(
    {
      publication_id: { type: DataTypes.UUID, primaryKey: true },
      image_url: { type: DataTypes.TEXT, primaryKey: true },
      order: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        validate: { min: 1, max: 3 },
      },
    },
    {
      sequelize,
      modelName: 'PublicationsImages',
      tableName: 'publications_images',
      underscored: true,
      timestamps: true,
      scopes: {
        view_public: { attributes: ['image_url', 'order'] },
      },
    }
  )
  return PublicationsImages
}
