"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("SpotImages", [
            {
                spotId: 1,
                imageUrl: "https://example.com/demo-pic.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 2,
                imageUrl: "https://example.com/demo-pic.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 3,
                imageUrl: "https://example.com/demo-pic.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 4,
                imageUrl: "https://example.com/demo-pic.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 5,
                imageUrl: "https://example.com/demo-pic.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("SpotImages", null, {});
    },
};
