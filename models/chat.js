"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.hasMany(models.Message, {
        foreignKey: "chatId",
        as: "messages",
      });

      Chat.belongsTo(models.User, {
        foreignKey: "customerId",
        as: "customer",
      });

      Chat.belongsTo(models.Business, {
        foreignKey: "businessId",
        as: "business",
      });
    }
  }

  Chat.init(
    {
      customerId: DataTypes.INTEGER,
      businessId: DataTypes.INTEGER,
      lastMessage: DataTypes.TEXT,
      lastMessageAt: DataTypes.DATE,
    },
    { sequelize, modelName: "Chat" }
  );

  return Chat;
};
