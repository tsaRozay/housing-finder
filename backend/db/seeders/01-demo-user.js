"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await User.bulkCreate(
            [
                {
                    email: "demo@user.io",
                    username: "Demo-lition",
                    firstName: "Demo",
                    lastName: "User",
                    hashedPassword: bcrypt.hashSync("password"),
                },
                {
                    email: "user1@user.io",
                    username: "FakeUser1",
                    firstName: "John",
                    lastName: "Doe",
                    hashedPassword: bcrypt.hashSync("password2"),
                },
                {
                    email: "user2@user.io",
                    username: "FakeUser2",
                    firstName: "Jane",
                    lastName: "Doe",
                    hashedPassword: bcrypt.hashSync("password3"),
                },
                {
                    email: "user3@user.io",
                    username: "FakeUser3",
                    firstName: "Michael",
                    lastName: "Jordan",
                    hashedPassword: bcrypt.hashSync("password4"),
                },
                {
                    email: "user4@user.io",
                    username: "FakeUser4",
                    firstName: "Micky",
                    lastName: "Living",
                    hashedPassword: bcrypt.hashSync("password5"),
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Users";
        await queryInterface.bulkDelete(
            options,
            null,
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