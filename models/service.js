"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.belongsTo(models.Business, {
        foreignKey: "businessId",
        as: "business",
      });

      Service.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });

      // Many-to-many with PaymentMethods
      Service.belongsToMany(models.PaymentMethod, {
        through: "ServicePaymentMethods",
        foreignKey: "serviceId",
        otherKey: "paymentMethodId",
        as: "paymentMethods",
      });
    }
  }

  Service.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      businessId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.FLOAT,
      durationInMinutes: DataTypes.INTEGER,

      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "Service",
      tableName: "Services",
    }
  );

  return Service;
};
