"use strict";
const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Reviews";
        await queryInterface.bulkInsert(
            options,
            [
                {
                    spotId: 1,
                    userId: 1,
                    review: "Love it!",
                    stars: 2,
                },
                {
                    spotId: 2,
                    userId: 2,
                    review: "Great location.",
                    stars: 4,
                },
                {
                    spotId: 3,
                    userId: 3,
                    review: "EWWW",
                    stars: 5,
                },
            ],
            { validate: true } // Enable validation
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Reviews";

        return queryInterface.bulkDelete(options, null, {});
    },
};