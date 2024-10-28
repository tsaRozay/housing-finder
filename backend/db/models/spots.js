'use strict';
const {
  Model, Validator
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(
        models.User,
        {
          as: "Owner",
          foreignKey: 'ownerId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      ),
        Spot.hasMany(
          models.SpotImage,
          {
            foreignKey: 'spotId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        ),
        Spot.hasMany(
          models.Booking,
          {
            foreignKey: 'spotId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
      )
      Spot.hasMany(
        models.Review,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      )
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "Address must be between 1 and 50 characters"
        },
        notEmpty: {msg: "Street address is required"}
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "City must be between 1 and 50 characters"
        },
        notEmpty: {msg: "City is required"}
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "State must be between 1 and 50 characters"
        },
        notEmpty: {msg: "State address is required"}
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "Address must be between 1 and 50 characters"
        },
        notEmpty: {msg: "Street address is required"}
      }
    },
    lat: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false,
      validate: {
        isFloat: true,
        min: {
          args: [-90],
          msg: 'Latitude must be within -90 and 90'
        },
        max: {
          args: [90],
          msg: 'Latitude must be within -90 and 90'
        },
        notNull: { msg: 'Latitude must be within -90 and 90' },
        isInt: true
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false,
      validate: {
        isFloat: true,
        min: {
          args: [-180],
          msg: 'Longitude must be within -180 and 180'
        },
        max: {
          args: [180],
          msg: 'Longitude must be within -180 and 180'
        },
        notNull: { msg: 'Longitude must be within -180 and 180' },
        isInt: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Name must be less than 50 characters'
        },
        notEmpty: { msg: 'Name is required' }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Description is required' }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        isFloat: true,
        min: {
          args: [0.01],
          msg: 'Price must be a positive number'
        },
        notNull: { msg: 'Price per day must be a positive number' }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};