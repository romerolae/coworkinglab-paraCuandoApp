'use strict'
const { Op } = require('sequelize')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkInsert('states', [
        {
          name: 'Nuevo León',
          country_id: '1',
          created_at: new Date(),
          updated_at: new Date()
        }
      ], { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkDelete('states', {
        name: {
          [Op.or]: ['Nuevo León']
        }
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}