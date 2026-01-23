'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubscriptionPlan extends Model {
    static associate(models) {
      // Add associations here if needed
    }
  }

  SubscriptionPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {            // e.g., "1 Month", "12 Months"
        type: DataTypes.STRING,
        allowNull: false,
      },
      durationMonths: {  // 1 or 12
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pricePerMonth: {  // 4, 5 USD etc.
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalPrice: {     // pricePerMonth * durationMonths
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      isBestValue: {    // highlight best value plan
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'SubscriptionPlan',
      tableName: 'SubscriptionPlans',
    }
  );

  return SubscriptionPlan;
};
