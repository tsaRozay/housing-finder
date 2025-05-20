"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}
options.tableName = "Spots";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert(
            options,
            [
                {
                    id: 1,
                    ownerId: 1,
                    address: "333 Cherry Lane",
                    city: "Newark",
                    state: "New Jersey",
                    country: "United States of America",
                    lat: 56.7635,
                    lng: -133.2472,
                    name: "Newark Room",
                    description: "Wake up next to the traffic",
                    price: 200,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    ownerId: 2,
                    address: "2200 Cherry Lane",
                    city: "New York",
                    state: "New York",
                    country: "United States of America",
                    lat: 39.0333,
                    lng: -145.6638,
                    name: "New York Home",
                    description: "Experience rats and luxury in the greatest city on Earth.",
                    price: 700,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    ownerId: 3,
                    address: "2900 Los Angeles Blvd",
                    city: "Los Angeles",
                    state: "California",
                    country: "United States of America",
                    lat: 80.4438,
                    lng: -22.0056,
                    name: "LA Home",
                    description: "Ashton Kutcher stayed here a couple times",
                    price: 900,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                id: { [Op.in]: [1, 2, 3] },
            },
            {}
        );
    },
};
