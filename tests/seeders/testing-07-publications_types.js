'use strict'
const { Op } = require('sequelize')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, /*Sequelize*/) {
    /* eslint-disable quotes */
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkInsert('publication_types', [
        {
          id: 1,
          name: 'Marcas y Tiendas',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          name: 'Artistas y Conciertos',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          name: 'Torneos',
          description: '',
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
      await queryInterface.bulkDelete('publication_types', {
        name: {
          [Op.or]: ['Marcas y Tiendas','Artistas y Conciertos','Torneos']
        }
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}