'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      ReviewImage.belongsTo(models.Review, {
        foreignKey: "reviewId",
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  ReviewImage.init({
    reviewId: { type: DataTypes.INTEGER, allowNull: false },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
      validate: { isUrl: true }
    }
  }, {
    sequelize,
    modelName: 'ReviewImage'
  });

  return ReviewImage;
};