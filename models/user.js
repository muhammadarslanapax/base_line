"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Business, {
        foreignKey: 'userId',
        as: 'business'
      });
    }
  }

  User.init(
    {
      uid: {
        type: DataTypes.STRING,
        allowNull: true,       
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,      
      },

      country: {
        type: DataTypes.STRING,
        allowNull: true,       
      },

      city: {
        type: DataTypes.STRING,
        allowNull: true,      
      },
      accessToken: {
        type: DataTypes.STRING,
        allowNull: true,      
      },
      deviceToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        comment: "Device token for push notifications",
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      method: {
        type: DataTypes.ENUM("email", "google", "facebook", "apple"),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("business", "user","admin"),
        allowNull: false,
      },
      
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
