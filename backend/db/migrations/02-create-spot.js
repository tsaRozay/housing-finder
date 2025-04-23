"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Spots",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                ownerId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Users",
                        key: "id",
                        as: "Owner",
                    },
                    onDelete: "CASCADE",
                },
                address: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                city: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                state: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                country: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                lat: {
                    type: Sequelize.DECIMAL(10, 6),
                    unique: false,
                },
                lng: {
                    type: Sequelize.DECIMAL(10, 6),
                    unique: false,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                price: {
                    type: Sequelize.DECIMAL(6, 2),
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            options
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Spots";
        await queryInterface.dropTable(options);
    },
};