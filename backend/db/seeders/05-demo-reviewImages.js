"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const reviewImages = [
            {
                reviewId: 1,
                url: "https://example.com/demo-pic.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                reviewId: 2,
                url: "https://example.com/demo-pic.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                reviewId: 3,
                url: "https://example.com/demo-pic.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                reviewId: 4,
                url: "https://example.com/demo-pic.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                reviewId: 5,
                url: "https://example.com/demo-pic.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert("ReviewImages", reviewImages);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("ReviewImages", null, {});
    },
};
