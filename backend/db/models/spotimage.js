"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class SpotImage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            SpotImage.belongsTo(models.Spot, {
                foreignKey: "spotId",
                as: "SpotImages",
            });
        }
    }
    SpotImage.init(
        {
            spotId: DataTypes.INTEGER,
            url: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    isUrl: true,
                },
            },
            preview: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "SpotImage",
            tableName: "SpotImages"
        }
    );
    return SpotImage;
};