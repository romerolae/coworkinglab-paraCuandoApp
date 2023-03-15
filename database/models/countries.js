'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Countries extends Model {
    static associate(models) {
      Countries.hasMany(models.Users, { as: 'users', foreignKey: 'country_id' })
      // Countries.hasMany(models.States, { as: 'states', foreignKey: 'country_id' })
    }
  }
  Countries.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Countries',
    tableName: 'countries',
    underscored: true,
    timestamps: true,
    scopes: {
      view_public: {
        attributes: ['id', 'name']
      },
      no_timestamps: {
        attributes: { exclude: ['created_at', 'updated_at'] }
      },
    },
  })
  return Countries
}