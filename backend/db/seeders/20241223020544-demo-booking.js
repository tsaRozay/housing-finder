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
                    userId: 3,
                    startDate: new Date("2025-07-20"),
                    endDate: new Date("2025-07-27"),
                },
                {
                    spotId: 3,
                    userId: 5,
                    startDate: new Date("2025-12-15"),
                    endDate: new Date("2025-12-22"),
                },
                {
                    spotId: 4,
                    userId: 4,
                    startDate: new Date("2025-09-10"),
                    endDate: new Date("2025-09-17"),
                },
                {
                    spotId: 5,
                    userId: 2,
                    startDate: new Date("2025-01-05"),
                    endDate: new Date("2025-01-12"),
                },
                {
                    spotId: 6,
                    userId: 1,
                    startDate: new Date("2025-03-10"),
                    endDate: new Date("2025-03-15"),
                },
                {
                    spotId: 7,
                    userId: 4,
                    startDate: new Date("2025-06-01"),
                    endDate: new Date("2025-06-08"),
                },
                {
                    spotId: 8,
                    userId: 2,
                    startDate: new Date("2025-10-25"),
                    endDate: new Date("2025-10-30"),
                },
                {
                    spotId: 9,
                    userId: 5,
                    startDate: new Date("2025-11-05"),
                    endDate: new Date("2025-11-12"),
                },
                {
                    spotId: 10,
                    userId: 3,
                    startDate: new Date("2025-02-14"),
                    endDate: new Date("2025-02-21"),
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
                    "2025-09-10",
                    "2025-01-05",
                    "2025-03-10",
                    "2025-06-01",
                    "2025-10-25",
                    "2025-11-05",
                    "2025-02-14",
                ],
            },
        });
    },
};