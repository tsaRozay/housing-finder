'use strict';

const { Review, User, Spot } = require('../models');
//^Import data
const reviewData = require('../data/reviewData');
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
      //! create set to enforce unique user/spot review combo (user cant review same spot twice)
      const assignedReviews = new Set();

      shuffleArray(users);
      shuffleArray(spots);

      reviewData.forEach((review, index) => {
        let userIndex = index % users.length;
        let spotIndex = index % spots.length;

        let userId = users[userIndex].id;
        let spot = spots[spotIndex];
        let spotId = spot.id;
        let reviewKey = `${userId}-${spotId}`;

        //! check user isnt reviewing own spot & cannot review same spot twice
        while ((userId === spot.ownerId || assignedReviews.has(reviewKey))) {
          spotIndex = (spotIndex + 1) % spots.length; //! get next spot

          //! if looped through all spots reset userindex
          if (spotIndex === 0) {
            userIndex = (userIndex + 1) % userId.length;
            userId = users[userIndex].id;
          }

          spot = spots[spotIndex];
          spotId = spot.id;
          reviewKey = `${userId}-${spotId}`;
        }

        //! add unique userId/spotId set
        assignedReviews.add(reviewKey);

        review.userId = userId;
        review.spotId = spotId;
      });


      await Review.bulkCreate(reviewData, { validate: true });
    } catch (error) {
      console.error('Error seeding reviews', error);
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options)
  }
};