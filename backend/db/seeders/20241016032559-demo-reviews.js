'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'Reviews',
            [
                {
                    userId: 1,
                    spotId: 1,
                    review: "An incredible stay at Capsule Corp! The tech is top-notch.",
                    stars: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    userId: 2,
                    spotId: 2,
                    review: "Kame House was a relaxing getaway. Beautiful views!",
                    stars: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    userId: 3,
                    spotId: 3,
                    review: "Kami's Lookout is a must-visit! The peace and quiet are unmatched.",
                    stars: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    userId: 1,
                    spotId: 4,
                    review: "King Kai's Planet is great for training, but not much else.",
                    stars: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    userId: 2,
                    spotId: 5,
                    review: "The Lookout offers a magical experience! Loved every moment.",
                    stars: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    userId: 3,
                    spotId: 6,
                    review: "Frieza's Spaceship is huge! A unique experience for adventurers.",
                    stars: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    userId: 1,
                    spotId: 7,
                    review: "Goku's Saiyan Pod is perfect for solo adventures! Fast and fun.",
                    stars: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    userId: 2,
                    spotId: 8,
                    review: "Majin Buu's House is chaotic but fun! Perfect for the adventurous.",
                    stars: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    userId: 3,
                    spotId: 9,
                    review: "Grand Elder Guru's House is peaceful and serene. Highly recommend!",
                    stars: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    userId: 1,
                    spotId: 10,
                    review: "The World Martial Arts Tournament Arena is an exciting place to stay!",
                    stars: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Reviews', null, {});
    },
};
