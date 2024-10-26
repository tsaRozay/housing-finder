"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("SpotImages", [
            {
                spotId: 1,
                url: "https://example.com/demo-pic.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 2,
                url: "https://example.com/demo-pic.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 3,
                url: "https://example.com/demo-pic.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 4,
                url: "https://example.com/demo-pic.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 5,
                url: "https://example.com/demo-pic.jpg",
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
