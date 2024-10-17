"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Spots",
            [
                {
                    name: "Capsule Corp",
                    location: "West City",
                    description:
                        "Stay at the iconic Capsule Corp, home of Bulma and Vegeta, with high-tech amenities and access to the latest technology.",
                    price: 150,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Kame House",
                    location: "Island near West City",
                    description:
                        "Relax at Master Roshi's Kame House, a peaceful retreat with a beautiful ocean view and a turtle companion.",
                    price: 100,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Kami's Lookout",
                    location: "Above Earth",
                    description:
                        "Experience the serenity of Kami's Lookout, where you can meditate and enjoy a breathtaking view of Earth.",
                    price: 200,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "King Kai's Planet",
                    location: "Other World",
                    description:
                        "Train under King Kai on his planet, with gravity training and access to legendary martial arts wisdom.",
                    price: 300,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "The Lookout",
                    location: "Near the Dragon Balls",
                    description:
                        "Stay at The Lookout, a magical place where the Dragon Balls are kept safe. Enjoy a mystical experience!",
                    price: 250,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Friezas Spaceship",
                    location: "Planet Namik",
                    description:
                        "Venture across the planets in this fully equipped, galactic traveler, this enormous spaceship is perfect for those with a taste for adventure.",
                    price: 300,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Goku's Saiyan Pod",
                    location: "Planet Earth",
                    description:
                        "This small, personal spaceship is ideal for solo adventures who need to get from one planet to another at lightning speed!",
                    price: 200,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Majin Buu's House",
                    location:
                        "Planet Earth, West of Gingertown and East of Yahhoy",
                    description:
                        "Welcome to the chaotic and fun residence of Majin Buu! Perfect for those who like quirky accomodations with a twist of danger!",
                    price: 350,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Grand Elder Guru's House",
                    location: "Planet Namek",
                    description:
                        "Enjoy this peaceful residence located on a quiet plateau, which offers unmatched views of the surrounding landscape.",
                    price: 300,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Goku's House",
                    location: "Mt. Paozu",
                    description:
                        "Nestled in the peaceful Mt. Paozu, this charming home is perfect for nature lovers who want to escape city life, ideal for families or solo travelers looking for tranquility.",
                    price: 350,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "The World Martial Arts Tournament Arena",
                    location: "Planet Earth",
                    description:
                        "Stay close to the action with front-row seats, ideal for those who love a good fight - who knows, you might even get to see Goku in action!",
                    price: 200,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "The Hyperbolic Time Chamber",
                    location:
                        "Above Earth, accessed through a door at Kami's Lookout",
                    description:
                        "Step inside this isolated, limitless dimension where time flows differently!",
                    price: 225,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Korin's Tower",
                    location: "In the Sacred Land of Korin on Earth",
                    description:
                        "Stay at the top of this sacred site, which offers unparalleled views of the world below.",
                    price: 325,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Yunzabit Heights",
                    location: "End of the Earth",
                    description:
                        "This remote, mysterious region is for adventures seeking extreme isolation, perfect for hardened warriors like Piccolo who thrive in desolate environments.",
                    price: 225,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "The Sacred Land of Korin",
                    location: "At the base of Korin's Tower",
                    description:
                        "This sacred land is ideal for travelers seeking spiritual awakening. Enjoy this landscape nestled between forests and mountains, providing ample opportunity for relaxation, reflection, and training.",
                    price: 350,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "King Yemma's Palace",
                    location: "Entrance of the Other World",
                    description:
                        "Experience the grandeur of this celestial palace, which offers a unique peek into the spiritual realm!",
                    price: 500,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Planet Sadala",
                    location: "Universe 6",
                    description:
                        "This lush, verdant planet is perfect for explorers who want to experience an alternate Saiyan civilization that is thriving and noble. Enjoy the home of the Saiyans!",
                    price: 475,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "King Cold's Palace",
                    location: "Planet Frieza",
                    description:
                        "This sleek, futuristic fortress offers cutting-edge technology and expansive views of the frozen world below. Enjoy a taste of luxury with a colder climate!",
                    price: 450,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Guru's Tower",
                    location: "Planet Namek",
                    description:
                        "Enjoy panoramic views of the Namekian landscape, serene surroundings, and spiritual guidance from the wise elder himself.",
                    price: 350,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Spots", null, {});
    },
};
