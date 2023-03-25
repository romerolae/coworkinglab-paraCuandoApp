'use strict';
const {Op} = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction();
    try{
      await queryInterface.bulkInsert(
        'states',
        [
          {
            id: '1',
            name: 'Antioquia',
            country_id: '1',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '2',
            name: 'Bolivar',
            country_id: '1',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      await transaction.commit()
    }catch(error){
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkDelete('states',{
        name:{
          [Op.or]:['Antioquia','Bolivar']
        }
      }, {transaction})
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
};
