"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Spot extends Model {
        static associate(models) {
            // Define associations here
            Spot.hasMany(models.Review, {
                foreignKey: "spotId",
                onDelete: "CASCADE",
            });
            Spot.belongsTo(models.User, {
                foreignKey: "ownerId",
                onDelete: "SET NULL",
            });
            Spot.hasMany(models.SpotImage, {
                foreignKey : "spotId",
                onDelete: "CASCADE",
            })
        }
    }

    Spot.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    min: 0,
                },
            },
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Users", // Reference to User model
                    key: "id",
                },
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lat: {
                type: DataTypes.DECIMAL(10, 8),
                allowNull: false,
            },
            lng: {
                type: DataTypes.DECIMAL(10, 8),
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Spot",
        }
    );

    return Spot;
};
