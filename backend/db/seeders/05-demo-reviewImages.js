"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // Define schema in options object if in production
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "ReviewImages";
        await queryInterface.bulkInsert(
            options,
            [
                {
                    reviewId: 1,
                    url: "www.examplepicture.com",
                },
                {
                    reviewId: 2,
                    url: "www.examplepicture2.com",
                },
                {
                    reviewId: 3,
                    url: "www.examplepicture3.com",
                },
            ],
            { validate: true } // Enable validation
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "ReviewImages";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                reviewId: { [Op.in]: [1, 2, 3] },
            },
            {}
        );
    },
};