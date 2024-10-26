'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SpotImage extends Model {
        static associate(models) {
            SpotImage.belongsTo(models.Spot, {
                foreignKey: 'spotId',
                onDelete: 'CASCADE',
            });
        }
    }

    SpotImage.init(
        {
            spotId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Spots',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            preview: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'SpotImage',
            tableName: 'SpotImages',
        }
    );

    return SpotImage;
};
