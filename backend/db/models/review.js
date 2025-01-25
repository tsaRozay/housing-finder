'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
      Review.belongsTo(models.User, { foreignKey: 'userId' });
      Review.hasMany(models.Image, {
        as: 'Images',
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'review'
        },
      });
    };
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Review text is required'
        },
        len: {
          args: [1,250],
          msg: 'Must be 250 or less characters'
        }
      },
    },
    stars: {
      type: DataTypes.DOUBLE('2', '2'),
      allowNull: false,
      defaultValue: 1,
      validate: {
        isNumeric: true,
        minMax(value) {
          if (value < 1 || value > 5) {
            throw new Error('Stars must be an integer from 1 to 5')
          };
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};