'use strict'
const uuid = require('uuid')
const { Op } = require('sequelize')
const { hashPassword } = require('../../libs/bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    const usersSeeds = [
      {
        id: uuid.v4(),
        first_name: 'USER1admin',
        last_name: 'USER1admin',
        email: 'user1admin@academlo.com',
        username: 'user1admin@academlo.com',
        password: hashPassword('passworduser1admin'),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid.v4(),
        first_name: 'USER2',
        last_name: 'USER2',
        email: 'user2@academlo.com',
        username: 'user2@academlo.com',
        password: hashPassword('passworduser2'),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid.v4(),
        first_name: 'USER3',
        last_name: 'USER3',
        email: 'user3@academlo.com',
        username: 'user3@academlo.com',
        password: hashPassword('passworduser3'),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    try {
      await queryInterface.bulkInsert('users', usersSeeds, { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    const userNames = [
      'user1admin@academlo.com','user2@academlo.com','user3@academlo.com'
    ]

    try {
      await queryInterface.bulkDelete(
        'users',
        {
          username: {
            [Op.or]: userNames,
          },
        },
        { transaction }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
