"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const reviewImages = [
            {
                reviewId: 1,
                imageUrl: "https://example.com/demo-pic.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                reviewId: 2,
                imageUrl: "https://example.com/demo-pic.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                reviewId: 3,
                imageUrl: "https://example.com/demo-pic.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                reviewId: 4,
                imageUrl: "https://example.com/demo-pic.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                reviewId: 5,
                imageUrl: "https://example.com/demo-pic.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert("ReviewImages", reviewImages);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkSelete("ReviewImages", null, {});
    },
};
