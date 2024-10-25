"use strict";

const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // Define association here
            User.hasMany(models.Review, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
        }
    }

    User.init(
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 50],
                },
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 50],
                },
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [4, 30],
                    isNotEmail(value) {
                        if (Validator.isEmail(value)) {
                            throw new Error("Cannot be an email.");
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
            // profilePic: {
            //     type: DataTypes.STRING,
            //     allowNull: true,
            // },
            // isHost: {
            //     type: DataTypes.BOOLEAN,
            //     allowNull: false,
            //     defaultValue: false,
            // },
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
            modelName: "User",
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
