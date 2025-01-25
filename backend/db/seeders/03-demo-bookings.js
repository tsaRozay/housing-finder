'use strict';

const { Booking, User, Spot } = require('../models');
//^Import data
const bookinData = require('../data/bookingData');
//^Import shuffler
const shuffleArray = require('../data/utils/shuffle');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const users = await User.findAll();
      const spots = await Spot.findAll();

      shuffleArray(users);
      shuffleArray(spots);

      bookinData.forEach((booking, index) => {
        let userId  = users[index % users.length].id; //! allows loop wrapping
        let spot = spots[index % spots.length];

        //! check user is not booking own spot
        while (userId === spot.ownerId) {
          //! get next user
          index = (index + 1) % users.length;
          userId = users[index].id;
        }

        booking.userId = userId;
        booking.spotId = spot.id;
      });

      await Booking.bulkCreate(bookinData, { validate: true });
    } catch (error) {
      console.error('Error seeding bookings', error);
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options);
  }
};