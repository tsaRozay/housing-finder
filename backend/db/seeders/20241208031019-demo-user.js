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
                    email: "demo1@user.io",
                    username: "Demo-lition1",
                    firstName: "Billy",
                    lastName: "Bob",
                    hashedPassword: bcrypt.hashSync("password"),
                },
                {
                    email: "user1@user.io",
                    username: "FakUser1",
                    firstName: "John",
                    lastName: "Smith",
                    hashedPassword: bcrypt.hashSync("password2"),
                },
                {
                    email: "user2@user.io",
                    username: "FakUser2",
                    firstName: "Jane",
                    lastName: "Doe",
                    hashedPassword: bcrypt.hashSync("password3"),
                },
                {
                    email: "user3@user.io",
                    username: "FakUser3",
                    firstName: "Keanu",
                    lastName: "Reeves",
                    hashedPassword: bcrypt.hashSync("password4"),
                },
                {
                    email: "user4@user.io",
                    username: "FakUser4",
                    firstName: "Will",
                    lastName: "Ferrell",
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
                        "Demo-lition1",
                        "FakUser1",
                        "FakUser2",
                        "FakUser3",
                        "FakUser4",
                    ],
                },
            },
            {}
        );
    },
};