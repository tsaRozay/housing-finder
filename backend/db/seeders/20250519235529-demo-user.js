"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
    options.tableName = "Users";
} else {
    options.tableName = "Users";
}

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert(
            options,
            [
                {
                  id: 1,
                    email: "demo@user.io",
                    username: "Demo-lition",
                    firstName: "Demo",
                    lastName: "User",
                    hashedPassword: bcrypt.hashSync("password"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    email: "user1@user.io",
                    username: "FakeUser1",
                    firstName: "John",
                    lastName: "Doe",
                    hashedPassword: bcrypt.hashSync("password2"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    email: "user2@user.io",
                    username: "FakeUser2",
                    firstName: "Jane",
                    lastName: "Doe",
                    hashedPassword: bcrypt.hashSync("password3"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    email: "user3@user.io",
                    username: "FakeUser3",
                    firstName: "Michael",
                    lastName: "Jordan",
                    hashedPassword: bcrypt.hashSync("password4"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    email: "user4@user.io",
                    username: "FakeUser4",
                    firstName: "Micky",
                    lastName: "Living",
                    hashedPassword: bcrypt.hashSync("password5"),
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
                username: {
                    [Op.in]: [
                        "Demo-lition",
                        "FakeUser1",
                        "FakeUser2",
                        "FakeUser3",
                        "FakeUser4",
                    ],
                },
            },
            {}
        );
    },
};
