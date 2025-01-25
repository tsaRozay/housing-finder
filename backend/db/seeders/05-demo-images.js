'use strict';

const { Image, Spot, Review } = require('../models');
//^import data
const imageData = require('../data/imageData');
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
      const spots = await Spot.findAll();
      const reviews = await Review.findAll();

      await shuffleArray(reviews);
      await shuffleArray(spots);

      //^ prevent review images from having a preview true during innitial testing
      let spotImages = [];
      let reviewImages = [];

      imageData.forEach( (image) => {
        if (image.imageableType === 'spot') {
          spotImages.push(image);
        } else if (image.imageableType === 'review') {
          if (image.preview !== true) {
            reviewImages.push(image);
          };
        };
      });

      spotImages.forEach((image, index) => {
        image.imageableId = spots[index % spots.length].id;
      });

      reviewImages.forEach((image, index) => {
        image.imageableId = reviews[index % reviews.length].id;
      });

      await Image.bulkCreate([...spotImages, ...reviewImages], { validate: true });
    } catch (error) {
      console.error('Error seeding images',error);
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Images';
    await queryInterface.bulkDelete(options);
  }
};