'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PublicationsTypes extends Model {
    static associate(models) {
      //Countries.hasMany(models.Users, { as: 'users', foreignKey: 'country_id' })
    }
  }
  PublicationsTypes.init(
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
      modelName: 'PublicationsTypes',
      tableName: 'publications_types',
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
  return PublicationsTypes
}
