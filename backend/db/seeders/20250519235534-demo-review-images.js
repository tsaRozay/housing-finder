"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const now = new Date();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "ReviewImages";
        await queryInterface.bulkInsert(options, [
            {
                reviewId: 1,
                url: "https://cdn-imgix.headout.com/tour/10974/TOUR-IMAGE/940303d2-f97e-4af4-aecd-e601a345e1a5-6013-new-york-twin-peaks-empire-state-building---top-of-the-rock-tickets-01.jpg?auto=format&w=1222.3999999999999&h=687.6&q=90&fit=crop&ar=16%3A9&crop=faces",
                createdAt: now,
                updatedAt: now,
            },
            {
                reviewId: 2,
                url: "https://www.examplepicture2.com",
                createdAt: now,
                updatedAt: now,
            },
            {
                reviewId: 3,
                url: "https://www.examplepicture3.com",
                createdAt: now,
                updatedAt: now,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "ReviewImages";
        await queryInterface.bulkDelete(options, null, {});
    },
};
