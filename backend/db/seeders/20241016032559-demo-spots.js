'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spots', [
      {
        name: 'Capsule Corp',
        location: 'West City',
        description: 'Stay at the iconic Capsule Corp, home of Bulma and Vegeta, with high-tech amenities and access to the latest technology.',
        price: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kame House',
        location: 'Island near West City',
        description: 'Relax at Master Roshi\'s Kame House, a peaceful retreat with a beautiful ocean view and a turtle companion.',
        price: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kami\'s Lookout',
        location: 'Above Earth',
        description: 'Experience the serenity of Kami\'s Lookout, where you can meditate and enjoy a breathtaking view of Earth.',
        price: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'King Kai\'s Planet',
        location: 'Other World',
        description: 'Train under King Kai on his planet, with gravity training and access to legendary martial arts wisdom.',
        price: 300,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'The Lookout',
        location: 'Near the Dragon Balls',
        description: 'Stay at The Lookout, a magical place where the Dragon Balls are kept safe. Enjoy a mystical experience!',
        price: 250,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', null, {});
  }
};
