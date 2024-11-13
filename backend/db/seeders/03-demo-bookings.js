'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-07'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2024-08-15'),
        endDate: new Date('2024-08-20'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2024-06-10'),
        endDate: new Date('2024-06-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
    ], options); // Passing options here to support schema if in production
  },

  async down (queryInterface, Sequelize) {
    // To revert the seed
    await queryInterface.bulkDelete('Bookings', null, options); // Using options to support schema
  }
};