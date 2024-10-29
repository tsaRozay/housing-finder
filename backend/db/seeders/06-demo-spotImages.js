"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
    options.tableName = 'SpotImages'
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(options, [
            {
                spotId: 1,
                url: "https://example.com/demo-pic1.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 2,
                url: "https://example.com/demo-pic2.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 3,
                url: "https://example.com/demo-pic3.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 4,
                url: "https://example.com/demo-pic4.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 5,
                url: "https://example.com/demo-pic5.jpg",
                preview: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(options, null, {});
    },
};
