"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ReviewImage extends Model {
        static associate(models) {
            ReviewImage.belongsTo(models.Review, {
                foreignKey: "reviewId",
                onDelete: "CASCADE",
            });
        }
    }

    ReviewImage.init(
        {
            reviewId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Reviews",
                    key: "id",
                },
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
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
            modelName: "ReviewImage",
            tableName: "ReviewImages",
        }
    );

    return ReviewImage;
};