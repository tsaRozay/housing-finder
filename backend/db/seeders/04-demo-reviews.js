"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // Define schema in options object if in production
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
                    review: "Food could be better on spotId1",
                    stars: 4,
                },
                {
                    spotId: 2,
                    userId: 2,
                    review: "Loved it had so much fun spotId2",
                    stars: 5,
                },
                {
                    spotId: 3,
                    userId: 3,
                    review: " spotId3 EWWW",
                    stars: 3,
                },
            ],
            { validate: true } // Enable validation
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Reviews";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                spotId: { [Op.in]: [1, 2, 3] },
            },
            {}
        );
    },
};