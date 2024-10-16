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
          lastName: 'User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'user1@user.io',
          username: 'FakeUser1',
          hashedPassword: bcrypt.hashSync('password2', 10),
          firstName: 'Fake',
          lastName: 'User1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'user2@user.io',
          username: 'FakeUser2',
          hashedPassword: bcrypt.hashSync('password3', 10),
          firstName: 'Fake',
          lastName: 'User2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'goku@dbz.io',
          username: 'Goku',
          hashedPassword: bcrypt.hashSync('kakarot', 10),
          firstName: 'Son',
          lastName: 'Goku',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'vegeta@dbz.io',
          username: 'Vegeta',
          hashedPassword: bcrypt.hashSync('prince', 10),
          firstName: 'Vegeta',
          lastName: 'Saiyan',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], { validate: true, ...options });

      console.log('Users successfully seeded');
    } catch (error) {
      console.error('Error seeding users:', error.message);
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
    return queryInterface.bulkDelete(options.tableName, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'Goku', 'Vegeta'] }
    }, {});
  }
};
