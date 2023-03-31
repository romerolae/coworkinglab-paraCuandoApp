'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PublicationTypes extends Model {
    static associate(models) {
      PublicationTypes.hasMany(models.Publications, {
        as: 'publications',
        foreignKey: 'publication_type_id',
      })
    }
  }
  PublicationTypes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PublicationTypes',
      tableName: 'publication_types',
      underscored: true,
      timestamps: true,
      scopes: {
        view_public: {
          attributes: ['id', 'name', 'description'],
        },
        no_timestamps: {
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
      },
    }
  )
  return PublicationTypes
}
