"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}
options.tableName = "Bookings";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert(options, [
            {
                spotId: 1,
                userId: 1,
                startDate: new Date("2025-05-01"),
                endDate: new Date("2025-05-07"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 2,
                userId: 2,
                startDate: new Date("2025-07-20"),
                endDate: new Date("2025-07-27"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 3,
                userId: 3,
                startDate: new Date("2025-12-15"),
                endDate: new Date("2025-12-22"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            startDate: {
                [Op.in]: [
                    new Date("2025-05-01"),
                    new Date("2025-07-20"),
                    new Date("2025-12-15"),
                ],
            },
        });
    },
};
