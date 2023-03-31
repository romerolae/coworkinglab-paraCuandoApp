'use strict'
const { Op } = require('sequelize')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkInsert('tags', [
        {
          name: 'Ropa y Accesorios',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Deportes',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Conciertos',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Meet & Greet',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'E-Sport',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Pop / Rock',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Tecnología',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Hogar y Decoración',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Abastecimiento',
          description: '',
          created_at: new Date(),
          updated_at: new Date()
        },
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
      await queryInterface.bulkDelete('tags', {
        name: {
          [Op.or]: [
            'Ropa y Accesorios',
            'Deportes',
            'Conciertos',
            'Meet & Greet',
            'E-Sport',
            'Pop / Rock',
            'Tecnología',
            'Hogar y Decoración',
            'Abastecimiento',
          ]
        }
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}