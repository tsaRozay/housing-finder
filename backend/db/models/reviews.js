'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            // Define associations here
            Review.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });
            Review.belongsTo(models.Spot, {
                foreignKey: 'spotId',
                onDelete: 'CASCADE',
            });
            Review.hasMany(models.ReviewImage, {
                foreignKey: 'reviewId',
                onDelete: 'CASCADE',
            });
        }
    }

    Review.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', 
                    key: 'id',
                },
            },
            spotId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Spots',
                    key: 'id',
                },
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
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
            modelName: 'Review',
        }
    );

    return Review;
};
