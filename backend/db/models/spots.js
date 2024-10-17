'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Spot extends Model {
        static associate(models) {
            // Define associations here
            Spot.hasMany(models.Review, {
                foreignKey: 'spotId',
                onDelete: 'CASCADE',
            });
            Spot.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'SET NULL',
            });
        }
    }

    Spot.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            location: {
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
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'Users', // Reference to User model
                    key: 'id',
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
            modelName: 'Spot',
        }
    );

    return Spot;
};
