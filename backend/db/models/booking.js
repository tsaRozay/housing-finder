'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
        Booking.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        });
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Booking.init({
    spotId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false }
  }, {
    sequelize,
    modelName: 'Booking'
  });
  return Booking;
};