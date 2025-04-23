"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const { Booking } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Bookings";
        await queryInterface.bulkInsert(
            options,
            [
                {
                    spotId: 1,
                    userId: 1,
                    startDate: new Date("2025-05-01"),
                    endDate: new Date("2025-05-07"),
                },
                {
                    spotId: 2,
                    userId: 2,
                    startDate: new Date("2025-07-20"),
                    endDate: new Date("2025-07-27"),
                },
                {
                    spotId: 3,
                    userId: 3,
                    startDate: new Date("2025-12-15"),
                    endDate: new Date("2025-12-22"),
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Bookings";
        const Op = Sequelize.Op;

        return queryInterface.bulkDelete(options, {
            startDate: {
                [Op.in]: [
                    "2025-05-01",
                    "2025-07-20",
                    "2025-12-15",
                ],
            },
        });
    },
};