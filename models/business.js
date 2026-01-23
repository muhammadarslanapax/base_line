'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      // Business belongs to a user
      Business.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

      // Business has many services
      Business.hasMany(models.Service, { foreignKey: 'businessId', as: 'services' });

      // Many-to-many with categories (if multiple allowed)
      Business.belongsToMany(models.Category, {
        through: 'BusinessCategories',
        foreignKey: 'businessId',
        otherKey: 'categoryId',
        as: 'categories',
      });

      // Many-to-many with payment methods
      Business.belongsToMany(models.PaymentMethod, {
        through: 'BusinessPaymentMethods',
        foreignKey: 'businessId',
        otherKey: 'paymentMethodId',
        as: 'paymentMethods',
      });
    }
  }

  Business.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Business',
      tableName: 'Businesses',
    }
  );

  return Business;
};
