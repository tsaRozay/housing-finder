"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // Define your schema in options object
}

const { Spot } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Spots";
        await queryInterface.bulkInsert(
            options,
            [
                {
                    ownerId: 1,
                    address: "Empire State Building, 20 W 34th St",
                    city: "New York",
                    state: "NY",
                    country: "USA",
                    lat: 40.748817,
                    lng: -73.985428,
                    name: "Empire State Building",
                    price: 50.0,
                    description:
                        "Experience the vibrant energy of New York City from the heart of Manhattan! Stay at this iconic skyscraper with breathtaking views of the city skyline.",
                },
                {
                    ownerId: 2,
                    address: "Eiffel Tower, Champ de Mars",
                    city: "Paris",
                    state: "Île-de-France",
                    country: "France",
                    lat: 48.858844,
                    lng: 2.29435,
                    name: "Eiffel Tower",
                    price: 30.0,
                    description:
                        "Live your Parisian dream! Stay near the iconic Eiffel Tower and soak in the romance of Paris with charming cafes, historic landmarks, and stunning views.",
                },
                {
                    ownerId: 3,
                    address: "Great Wall of China, Huairou",
                    city: "Beijing",
                    state: "Beijing",
                    country: "China",
                    lat: 40.431907,
                    lng: 116.570374,
                    name: "Great Wall of China",
                    price: 15.0,
                    description:
                        "Discover the ancient wonder of the Great Wall of China. Immerse yourself in history while enjoying the tranquil beauty of the surrounding countryside.",
                },
                {
                    ownerId: 1,
                    address: "Taj Mahal, Dharmapuri",
                    city: "Agra",
                    state: "Uttar Pradesh",
                    country: "India",
                    lat: 27.175144,
                    lng: 78.042142,
                    name: "Taj Mahal",
                    price: 25.0,
                    description:
                        "Stay near one of the world’s most breathtaking monuments! The Taj Mahal offers an unforgettable blend of beauty, history, and culture in the heart of India.",
                },
                {
                    ownerId: 4,
                    address: "Colosseum, Piazza del Colosseo",
                    city: "Rome",
                    state: "Lazio",
                    country: "Italy",
                    lat: 41.89021,
                    lng: 12.492231,
                    name: "Colosseum",
                    price: 18.0,
                    description:
                        "Step back in time with a stay near the majestic Colosseum. Explore the timeless charm of Rome with its ancient ruins, delightful cuisine, and rich culture.",
                },
                {
                    ownerId: 3,
                    address: "Sydney Opera House, Bennelong Point",
                    city: "Sydney",
                    state: "New South Wales",
                    country: "Australia",
                    lat: -33.856784,
                    lng: 151.215297,
                    name: "Sydney Opera House",
                    price: 35.0,
                    description:
                        "Wake up to stunning harbor views and the iconic silhouette of the Sydney Opera House. Enjoy vibrant city life and world-class attractions at your doorstep.",
                },
                {
                    ownerId: 2,
                    address: "Stonehenge, Salisbury",
                    city: "Wiltshire",
                    state: "England",
                    country: "UK",
                    lat: 51.178882,
                    lng: -1.826215,
                    name: "Stonehenge",
                    price: 12.0,
                    description:
                        "Unwind in the peaceful English countryside near the mysterious Stonehenge. Perfect for history enthusiasts and those seeking a serene getaway.",
                },
                {
                    ownerId: 4,
                    address: "Pyramids of Giza, Al Haram",
                    city: "Giza",
                    state: "Giza Governorate",
                    country: "Egypt",
                    lat: 29.979235,
                    lng: 31.134202,
                    name: "Pyramids of Giza",
                    price: 40.0,
                    description:
                        "Marvel at the timeless grandeur of the Pyramids of Giza. This stay offers a unique blend of ancient history and modern comforts in a stunning desert setting.",
                },
                {
                    ownerId: 4,
                    address: "Machu Picchu, Aguas Calientes",
                    city: "Cusco",
                    state: "Cusco Region",
                    country: "Peru",
                    lat: -13.162141,
                    lng: -72.544963,
                    name: "Machu Picchu",
                    price: 28.0,
                    description:
                        "Explore the wonders of the Andes with a stay near Machu Picchu. Perfect for adventurers and nature lovers seeking an unforgettable escape.",
                },
                {
                    ownerId: 5,
                    address: "Burj Khalifa, Sheikh Mohammed bin Rashid Blvd",
                    city: "Dubai",
                    state: "Dubai",
                    country: "United Arab Emirates",
                    lat: 25.197197,
                    lng: 55.274376,
                    name: "Burj Khalifa",
                    price: 60.0,
                    description:
                        "Elevate your stay with unparalleled luxury near the Burj Khalifa. Enjoy Dubai’s world-famous shopping, dining, and nightlife in the lap of modern opulence.",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Spots";
        await queryInterface.bulkDelete(options, null, {});
    },
};