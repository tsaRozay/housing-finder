"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
    options.tableName = 'Bookings'
}

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(options, [
            {
                spotId: 1,
                userId: 1,
                startDate: new Date("2024-10-01"),
                endDate: new Date("2024-10-10"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 2,
                userId: 2,
                startDate: new Date("2024-11-05"),
                endDate: new Date("2024-11-12"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                spotId: 3,
                userId: 3,
                startDate: new Date("2024-12-01"),
                endDate: new Date("2024-12-10"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(options, null, {});
    },
};
