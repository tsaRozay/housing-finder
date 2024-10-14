'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Seeding Users...');

    let options = {};
    if (process.env.NODE_ENV === 'production' && process.env.SCHEMA) {
      options.schema = process.env.SCHEMA;
    }
    options.tableName = 'Users';

    try {
      await User.bulkCreate([
        {
          email: 'demo@user.io',
          username: 'Demo-lition',
          hashedPassword: bcrypt.hashSync('password', 10),
          firstName: 'Demo',
          lastName: 'User'
        },
        {
          email: 'user1@user.io',
          username: 'FakeUser1',
          hashedPassword: bcrypt.hashSync('password2', 10),
          firstName: 'Fake',
          lastName: 'User1'
        },
        {
          email: 'user2@user.io',
          username: 'FakeUser2',
          hashedPassword: bcrypt.hashSync('password3', 10),
          firstName: 'Fake',
          lastName: 'User2'
        }
      ], { validate: true, ...options });

      console.log('Users successfully seeded');
    } catch (error) {
      console.error('Error seeding users:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    console.log('Removing seeded Users...');

    let options = {};
    if (process.env.NODE_ENV === 'production' && process.env.SCHEMA) {
      options.schema = process.env.SCHEMA;
    }
    options.tableName = 'Users';

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
