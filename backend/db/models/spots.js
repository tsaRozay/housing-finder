'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
    //   Spot.belongsTo(models.User, { foreignKey: 'ownerId' });  
    //   Spot.hasMany(models.Review, { foreignKey: 'spotId' });
    //   Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
    //   Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });
    }
  }

  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL(10, 8), // Consider specifying precision and scale
      allowNull: false,
      validate: {
        len: [8, 10]
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10, 8), // Consider specifying precision and scale
      allowNull: false,
      validate: {
        len: [8, 10]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Consider specifying precision and scale
      allowNull: false,
      validate: {
        min: 0,
      }
    },
  }, {
    sequelize,
    modelName: 'Spot',
    tableName: 'Spots',
  });

  return Spot;
};
