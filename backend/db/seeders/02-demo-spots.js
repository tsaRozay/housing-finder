'use strict';

const { Spot, User } = require('../models');
//^import spots data
const spotsData = require('../data/spotData');
//^import shuffler
const shuffleArray = require('../data/utils/shuffle')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await User.findAll();

    shuffleArray(users);

    spotsData.forEach((spot, index) => {
      spot.ownerId = users[index].id;
    });


    try {
      await Spot.bulkCreate(spotsData, { validate: true });
    } catch (error) {
      console.error('error seeding spots', error)
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options)
  }
};