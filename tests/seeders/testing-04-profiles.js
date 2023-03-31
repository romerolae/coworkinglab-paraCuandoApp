'use strict'
const { Op } = require('sequelize')
const rolesServices = require('../../services/roles.service')
const usersServices = require('../../services/users.service')

const rolesService = new rolesServices()
const usersService = new usersServices()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()    
    try {
      const adminUser = await usersService.findUserByEmailOr404('user1admin@academlo.com')
      const publicUser2 = await usersService.findUserByEmailOr404('user2@academlo.com')
      const publicUser3 = await usersService.findUserByEmailOr404('user3@academlo.com')
      const adminRole = await rolesService.findRoleByName('admin')
      const publicRole = await rolesService.findRoleByName('public')
      
      const profiles = [
        {
          user_id: adminUser.id,
          role_id: adminRole.id,
          created_at: new Date(),
          updated_at: new Date(),
        }, 
        {
          user_id: publicUser2.id,
          role_id: publicRole.id,
          created_at: new Date(),
          updated_at: new Date(),
        }, 
        {
          user_id: publicUser3.id,
          role_id: publicRole.id,
          created_at: new Date(),
          updated_at: new Date(),
        } 
      ]
      
      await queryInterface.bulkInsert('profiles', profiles , {transaction})
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const adminUser = await usersService.findUserByEmailOr404('user1admin@academlo.com')
      const publicUser2 = await usersService.findUserByEmailOr404('user2@academlo.com')
      const publicUser3 = await usersService.findUserByEmailOr404('user3@academlo.com')
      const adminRole = await rolesService.findRoleByName('admin')
      // const publicRole = await rolesService.findRoleByName('public')
      
      await queryInterface.bulkDelete('profiles', {
        user_id: {
          [Op.and]: [adminUser.id]
        },
        role_id:{
          [Op.and]:[adminRole.id]
        }
      }, { transaction })

      await queryInterface.bulkDelete('profiles', {
        user_id: {
          [Op.or]: [publicUser2.id, publicUser3.id]
        }
      }, { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
