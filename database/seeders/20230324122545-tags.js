'use strict';
const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'tags',
        [
          {
            id: '1',
            name: 'Apparel and Accessories',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '2',
            name: 'Sports',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '3',
            name: 'Concerts',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '4',
            name: 'Meet and Greet',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '5',
            name: 'E-Sport',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '6',
            name: 'Pop / Rock',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '7',
            name: 'Technology',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '8',
            name: 'Home and Decoration',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '9',
            name: 'Supplying',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete(
        'states',
        {
          name: {
            [Op.or]: [
              'Supplying',
              'Home and Decoration',
              'Technology',
              'Pop / Rock',
              'E-Sport',
              'Meet and Greet',
              'Concerts',
              'Sports',
              'Apparel and Accessories',
            ],
          },
        },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
