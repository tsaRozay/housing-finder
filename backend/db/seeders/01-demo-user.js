"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production" && process.env.SCHEMA) {
    options.schema = process.env.SCHEMA;
}
options.tableName = "Users";

module.exports = {
    async up(queryInterface, Sequelize) {

        try {
            await User.bulkCreate(
                options,
                [
                    {
                        email: "demo@user.io",
                        username: "Demo-lition",
                        hashedPassword: bcrypt.hashSync("password", 10),
                        firstName: "Demo",
                        lastName: "User",
                        // profilePic: 'https://example.com/demo-pic.jpg', // Add a placeholder profile pic
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        email: "user1@user.io",
                        username: "FakeUser1",
                        hashedPassword: bcrypt.hashSync("password2", 10),
                        firstName: "Fake",
                        lastName: "User1",
                        // profilePic: 'https://example.com/fakeuser1-pic.jpg',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        email: "user2@user.io",
                        username: "FakeUser2",
                        hashedPassword: bcrypt.hashSync("password3", 10),
                        firstName: "Fake",
                        lastName: "User2",
                        // profilePic: 'https://example.com/fakeuser2-pic.jpg',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        email: "goku@dbz.io",
                        username: "Goku",
                        hashedPassword: bcrypt.hashSync("kakarot", 10),
                        firstName: "Son",
                        lastName: "Goku",
                        // profilePic: 'https://example.com/goku-pic.jpg',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        email: "vegeta@dbz.io",
                        username: "Vegeta",
                        hashedPassword: bcrypt.hashSync("prince", 10),
                        firstName: "Vegeta",
                        lastName: "Saiyan",
                        // profilePic: 'https://example.com/vegeta-pic.jpg',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
                { validate: true, ...options }
            );
        } catch (error) {
            console.error("Error seeding users:", error.message);
        }
    },

    async down(queryInterface, Sequelize) {

        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                username: {
                    [Op.in]: [
                        "Demo-lition",
                        "FakeUser1",
                        "FakeUser2",
                        "Goku",
                        "Vegeta",
                    ],
                },
            },
            {}
        );
    },
};
