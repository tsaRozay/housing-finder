"use strict";
const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Reviews";
        await queryInterface.bulkInsert(
            options,
            [
                // Empire State Building, New York
                {
                    spotId: 1,
                    userId: 1,
                    review: "The Empire State Building offers an amazing view of New York City. Highly recommend the observation deck!",
                    stars: 5,
                },
                {
                    spotId: 1,
                    userId: 5,
                    review: "Great location in the heart of NYC! The building itself is iconic, but it gets crowded, and the wait times can be long.",
                    stars: 4,
                },
                {
                    spotId: 1,
                    userId: 4,
                    review: "Loved the art-deco vibe inside the building. Perfect for a quick stop during a day exploring Manhattan!",
                    stars: 5,
                },
                // Eiffel Tower, Paris
                {
                    spotId: 2,
                    userId: 2,
                    review: "Visiting the Eiffel Tower at night is a magical experience, especially when the lights twinkle. A must-see in Paris.",
                    stars: 5,
                },
                {
                    spotId: 2,
                    userId: 3,
                    review: "Romantic and picturesque! Perfect for photos and enjoying the Parisian atmosphere. Bring a picnic for the park nearby!",
                    stars: 5,
                },
                {
                    spotId: 2,
                    userId: 5,
                    review: "Cool to see but expensive for what it is. Not much to do beyond taking photos.",
                    stars: 3,
                },
                // Great Wall of China, Beijing
                {
                    spotId: 3,
                    userId: 2,
                    review: "The Great Wall is an incredible feat of engineering. It's a long walk but the views are worth every step.",
                    stars: 4,
                },
                {
                    spotId: 3,
                    userId: 4,
                    review: "Amazing experience, but avoid weekends — too crowded! Wear comfy shoes, and take plenty of water.",
                    stars: 5,
                },
                // Taj Mahal, Agra
                {
                    spotId: 4,
                    userId: 4,
                    review: "The Taj Mahal is even more beautiful in person than in photos. The intricate design and the history behind it are remarkable.",
                    stars: 5,
                },
                {
                    spotId: 4,
                    userId: 2,
                    review: "Woke up at sunrise for this, and it was totally worth it. Stunning and peaceful before the crowds arrive.",
                    stars: 5,
                },
                {
                    spotId: 4,
                    userId: 3,
                    review: "It’s gorgeous, but the area surrounding it is very crowded and chaotic. Be prepared for aggressive sellers.",
                    stars: 4,
                },
                // Colosseum, Rome
                {
                    spotId: 5,
                    userId: 5,
                    review: "The Colosseum is a fantastic piece of history. It's amazing to think about how it was used in ancient times for gladiator games.",
                    stars: 4,
                },
                {
                    spotId: 5,
                    userId: 1,
                    review: "It’s awe-inspiring, but parts are under renovation, and it felt a bit too touristy.",
                    stars: 4,
                },
                // Sydney Opera House, Sydney
                {
                    spotId: 6,
                    userId: 3,
                    review: "The Opera House is iconic, and the harbor views are stunning. Perfect for a stroll or a night out.",
                    stars: 5,
                },
                {
                    spotId: 6,
                    userId: 2,
                    review: "Amazing architecture, but there’s not much to do unless you’re seeing a show.",
                    stars: 4,
                },
                // Stonehenge, Wiltshire
                {
                    spotId: 7,
                    userId: 5,
                    review: "Stonehenge is fascinating, but I was surprised at how small the stones looked in person. Still worth a visit for the history!",
                    stars: 4,
                },
                {
                    spotId: 7,
                    userId: 1,
                    review: "Absolutely stunning location! The audio guide helped a lot to understand the history and significance.",
                    stars: 5,
                },
                {
                    spotId: 7,
                    userId: 2,
                    review: "A bit pricey for what it is, but the surrounding area is lovely for a walk.",
                    stars: 3,
                },
                // Pyramids of Giza, Giza
                {
                    spotId: 8,
                    userId: 4,
                    review: "Standing in front of the Pyramids is an unforgettable experience. The camel rides nearby were fun but pricey.",
                    stars: 5,
                },
                {
                    spotId: 8,
                    userId: 3,
                    review: "The history here is unmatched, but the area is full of vendors and can feel overwhelming. Worth it though!",
                    stars: 4,
                },
                // Machu Picchu, Cusco
                {
                    spotId: 9,
                    userId: 5,
                    review: "Machu Picchu is absolutely stunning. The hike up is tough, but the views are 100% worth it.",
                    stars: 5,
                },
                {
                    spotId: 9,
                    userId: 2,
                    review: "Incredible place! Be sure to book your tickets early. It gets busy but still feels magical.",
                    stars: 4,
                },
                // Burj Khalifa, Dubai
                {
                    spotId: 10,
                    userId: 5,
                    review: "The view from the top of the Burj Khalifa is incredible! Be sure to go around sunset for the best experience.",
                    stars: 5,
                },
                {
                    spotId: 10,
                    userId: 1,
                    review: "It’s super tall and impressive, but the lines and ticket prices were steep. Still a must-see in Dubai.",
                    stars: 4,
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Reviews";

        return queryInterface.bulkDelete(options, null, {});
    },
};