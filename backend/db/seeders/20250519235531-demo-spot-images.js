"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const now = new Date();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = "SpotImages";
        return queryInterface.bulkInsert(options, [
            {
                spotId: 1,
                url: "https://images.pexels.com/photos/15067166/pexels-photo-15067166/free-photo-of-taxi-on-a-city-street.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                preview: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                spotId: 1,
                url: "https://images.pexels.com/photos/2224861/pexels-photo-2224861.png",
                preview: false,
                createdAt: now,
                updatedAt: now,
            },
            {
                spotId: 2,
                url: "https://images.pexels.com/photos/2695679/pexels-photo-2695679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                preview: true,
                createdAt: now,
                updatedAt: now,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = "SpotImages";
        return queryInterface.bulkDelete(options, null, {});
    },
};
