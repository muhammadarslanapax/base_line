'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserSubscription extends Model {
    static associate(models) {
      UserSubscription.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
      });

      UserSubscription.belongsTo(models.SubscriptionPlan, {
        foreignKey: "planId",
        as: "plan"
      });
    }
  }

  UserSubscription.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      planId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "UserSubscription",
      tableName: "UserSubscriptions"
    }
  );

  return UserSubscription;
};
