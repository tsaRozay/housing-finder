"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // Define schema in options object if in production
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = "SpotImages";
        return queryInterface.bulkInsert(
            options,
            [
                {
                    spotId: 1,
                    url: "https://images.pexels.com/photos/15067166/pexels-photo-15067166/free-photo-of-taxi-on-a-city-street.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                    preview: true,
                },
                {
                    spotId: 1,
                    url: "https://images.pexels.com/photos/2224861/pexels-photo-2224861.png",
                    preview: false,
                },
                {
                    spotId: 2,
                    url: "https://examplepicture.com/image3.jpghttps://images.pexels.com/photos/2695679/pexels-photo-2695679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                    preview: true,
                },
            ],
            { validate: true } // Enable validation for data integrity
        );
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = "SpotImages";
        return queryInterface.bulkDelete(options, null, {}); // Use options to support schema if in production
    },
};