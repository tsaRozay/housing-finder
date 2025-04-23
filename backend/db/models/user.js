"use strict";
const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Review, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });

            User.hasMany(models.Booking, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });

            User.hasMany(models.Spot, {
                foreignKey: "ownerId",
                as: "Owner",
                onDelete: "CASCADE",
            });
        }
    }
    User.init(
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [4, 30],
                    isNotEmail(value) {
                        if (Validator.isEmail(value)) {
                            throw new Error("Cannot be an email");
                        }
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 256],
                    isEmail: true,
                },
            },
            hashedPassword: {
                type: DataTypes.STRING.BINARY,
                allowNull: false,
                validate: {
                    len: [60, 60],
                },
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "Users",
            defaultScope: {
                attributes: {
                    exclude: [
                        "hashedPassword",
                        "email",
                        "createdAt",
                        "updatedAt",
                    ],
                },
            },
        }
    );
    return User;
};