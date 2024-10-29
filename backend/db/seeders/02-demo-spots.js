"use strict";

const { Spot } = require("../models");

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
    options.tableName = 'Spots'
}

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            options,
            [
                {
                    ownerId: 1, // Example ownerId for demonstration
                    address: "123 Capsule Corp Ave",
                    city: "West City",
                    state: "West Capital",
                    country: "Earth",
                    lat: 34.679,
                    lng: 135.459,
                    name: "Capsule Corp",
                    description:
                        "Stay at the iconic Capsule Corp, home of Bulma and Vegeta, with high-tech amenities and access to the latest technology.",
                    price: 150,
                    
                },
                {
                    ownerId: 2,
                    address: "456 Kame House Rd",
                    city: "Island near West City",
                    state: "Unknown",
                    country: "Earth",
                    lat: 34.658,
                    lng: 135.454,
                    name: "Kame House",
                    description:
                        "Relax at Master Roshi's Kame House, a peaceful retreat with a beautiful ocean view and a turtle companion.",
                    price: 100,
                    
                },
                {
                    ownerId: 3,
                    address: "Kami's Lookout, Above Earth",
                    city: "Unknown",
                    state: "Unknown",
                    country: "Earth",
                    lat: 34.679,
                    lng: 135.459,
                    name: "Kami's Lookout",
                    description:
                        "Experience the serenity of Kami's Lookout, where you can meditate and enjoy a breathtaking view of Earth.",
                    price: 200,
                    
                },
                {
                    ownerId: 1,
                    address: "King Kai's Planet",
                    city: "Other World",
                    state: "Unknown",
                    country: "Other World",
                    lat: 35.678,
                    lng: 135.678,
                    name: "King Kai's Planet",
                    description:
                        "Train under King Kai on his planet, with gravity training and access to legendary martial arts wisdom.",
                    price: 300,
                    
                },
                {
                    ownerId: 2,
                    address: "Near the Dragon Balls",
                    city: "Unknown",
                    state: "Unknown",
                    country: "Earth",
                    lat: 34.678,
                    lng: 135.458,
                    name: "The Lookout",
                    description:
                        "Stay at The Lookout, a magical place where the Dragon Balls are kept safe. Enjoy a mystical experience!",
                    price: 250,
                    
                },
                {
                    ownerId: 3,
                    address: "Frieza's Spaceship",
                    city: "Planet Namik",
                    state: "Unknown",
                    country: "Namik",
                    lat: 34.123,
                    lng: 135.456,
                    name: "Frieza's Spaceship",
                    description:
                        "Venture across the planets in this fully equipped, galactic traveler. This enormous spaceship is perfect for those with a taste for adventure.",
                    price: 300,
                    
                },
                {
                    ownerId: 1,
                    address: "Goku's Saiyan Pod",
                    city: "Planet Earth",
                    state: "Unknown",
                    country: "Earth",
                    lat: 34.789,
                    lng: 135.123,
                    name: "Goku's Saiyan Pod",
                    description:
                        "This small, personal spaceship is ideal for solo adventures who need to get from one planet to another at lightning speed!",
                    price: 200,
                    
                },
                {
                    ownerId: 2,
                    address: "Majin Buu's House",
                    city: "West of Gingertown",
                    state: "East of Yahhoy",
                    country: "Earth",
                    lat: 34.567,
                    lng: 135.678,
                    name: "Majin Buu's House",
                    description:
                        "Welcome to the chaotic and fun residence of Majin Buu! Perfect for those who like quirky accommodations with a twist of danger!",
                    price: 350,
                    
                },
                {
                    ownerId: 3,
                    address: "Grand Elder Guru's House",
                    city: "Planet Namek",
                    state: "Unknown",
                    country: "Namik",
                    lat: 34.456,
                    lng: 135.123,
                    name: "Grand Elder Guru's House",
                    description:
                        "Enjoy this peaceful residence located on a quiet plateau, which offers unmatched views of the surrounding landscape.",
                    price: 300,
                    
                },
                {
                    ownerId: 1,
                    address: "Goku's House",
                    city: "Mt. Paozu",
                    state: "Unknown",
                    country: "Earth",
                    lat: 34.987,
                    lng: 135.234,
                    name: "Goku's House",
                    description:
                        "Nestled in the peaceful Mt. Paozu, this charming home is perfect for nature lovers who want to escape city life, ideal for families or solo travelers looking for tranquility.",
                    price: 350,
                    
                },
                {
                    ownerId: 2,
                    address: "The World Martial Arts Tournament Arena",
                    city: "Planet Earth",
                    state: "Unknown",
                    country: "Earth",
                    lat: 34.876,
                    lng: 135.567,
                    name: "The World Martial Arts Tournament Arena",
                    description:
                        "Stay close to the action with front-row seats, ideal for those who love a good fight - who knows, you might even get to see Goku in action!",
                    price: 200,
                    
                },
                {
                    ownerId: 3,
                    address: "The Hyperbolic Time Chamber",
                    city: "Above Earth",
                    state: "Unknown",
                    country: "Earth",
                    lat: 34.765,
                    lng: 135.456,
                    name: "The Hyperbolic Time Chamber",
                    description:
                        "Step inside this isolated, limitless dimension where time flows differently!",
                    price: 225,
                    
                },
                {
                    ownerId: 1,
                    address: "Korin's Tower",
                    city: "In the Sacred Land of Korin",
                    state: "Earth",
                    country: "Earth",
                    lat: 34.654,
                    lng: 135.345,
                    name: "Korin's Tower",
                    description:
                        "Stay at the top of this sacred site, which offers unparalleled views of the world below.",
                    price: 325,
                    
                },
                {
                    ownerId: 2,
                    address: "Planet Sadala",
                    city: "Universe 6",
                    state: "Unknown",
                    country: "Universe 6",
                    lat: 35.654,
                    lng: 135.123,
                    name: "Planet Sadala",
                    description:
                        "This lush, verdant planet is perfect for explorers and adventurers who want to experience the beauty of Universe 6.",
                    price: 600,
                    
                },
                {
                    ownerId: 3,
                    address: "Supreme Kai's Planet",
                    city: "Unknown",
                    state: "Unknown",
                    country: "Other World",
                    lat: 34.678,
                    lng: 135.456,
                    name: "Supreme Kai's Planet",
                    description:
                        "Stay at the Supreme Kai's sacred domain, a breathtaking realm that offers peace and contemplation.",
                    price: 700,
                    
                },
                {
                    ownerId: 1,
                    address: "Planet Namek",
                    city: "Unknown",
                    state: "Unknown",
                    country: "Namik",
                    lat: 34.234,
                    lng: 135.678,
                    name: "Planet Namek",
                    description:
                        "The beautiful, peaceful planet known for its Dragon Balls. Perfect for nature lovers and spiritual seekers alike.",
                    price: 500,
                    
                },
                {
                    ownerId: 2,
                    address: "Earth's Moon",
                    city: "Unknown",
                    state: "Unknown",
                    country: "Earth",
                    lat: 34.987,
                    lng: 135.123,
                    name: "Earth's Moon",
                    description:
                        "Experience the quiet serenity of Earth's moon. A perfect getaway for stargazers and romantic souls.",
                    price: 300,
                    
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Spots"
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete( options, {
            name : {
                [Op.in] : [
                    "Capsule Corp",
    "Kame House",
    "Kami's Lookout",
    "King Kai's Planet",
    "The Lookout",
    "Frieza's Spaceship",
    "Goku's Saiyan Pod",
    "Majin Buu's House",
    "Grand Elder Guru's House",
    "Goku's House",
    "The World Martial Arts Tournament Arena",
    "The Hyperbolic Time Chamber",
    "Korin's Tower",
    "Planet Sadala",
    "Supreme Kai's Planet",
    "Planet Namek",
    "Earth's Moon"
                ]
            }
        });
    },
};
