'use strict';

const {
  Model,
  Validator
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId' });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
      Spot.hasMany(models.Image, {
        as: 'Images',
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'spot'
        }
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Street address is required'
        },
        len: [2,150]
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'City is required'
        },
        len: [2,60]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'State is required'
        },
        len: [2,60]
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Country is required'
        },
        len: [2,60]
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: true,
        isFloat: true,
        isLat(value) {
          if (value < -90 || value > 90) {
            throw new Error('Latitude must be between -90 and 90');
          };
        }
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: true,
        isFloat: true,
        isLng(value) {
          if (value < -180 || value > 180) {
            throw new Error('Longitude must be between -180 and 180');
          };
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Spot must have a name'
        },
        len: {
          args: [2,49],
          msg: 'Name must be less than 50 characters'
        }
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description is required'
        },
        len: {
          args: [2,250],
          msg: 'Descritpion must be 250 characters or less'
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: {
          args: 1,
          msg: 'Price per day must be a positive number'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Spot'
  });
  return Spot;
};
 