'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      User.hasMany(models.Booking, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      User.hasMany(models.Review, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  const stringValidation = (fieldName, minLength, maxLength) => ({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [minLength, maxLength],
        msg: `${fieldName} must be between ${minLength} and ${maxLength} characters`
      },
      notEmpty: { msg: `${fieldName} is required` },
      notNull: { msg: `${fieldName} is required` }
    }
  });

  User.init(
    {
      firstName: stringValidation('First name', 1, 50),
      lastName: stringValidation('Last name', 1, 50),
      username: {
        ...stringValidation('Username', 4, 30),
        unique: true,
        validate: {
          ...stringValidation('Username', 4, 30).validate,
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          }
        }
      },
      email: {
        ...stringValidation('Email', 3, 256),
        unique: true,
        validate: {
          ...stringValidation('Email', 3, 256).validate,
          isEmail: { args: [true], msg: "Invalid email" }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: { exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'] },
      },
      scopes: {
        currentUser: { attributes: { exclude: ["hashedPassword", "createdAt", "updatedAt"] } },
        loginUser: { attributes: { exclude: ["createdAt", "updatedAt"] } }
      }
    }
  );

  return User;
};