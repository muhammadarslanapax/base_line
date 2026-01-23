"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Chat, {
        foreignKey: "chatId",
        as: "chat",
      });

      Message.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
      });

      Message.belongsTo(models.User, {
        foreignKey: "receiverId",
        as: "receiver",
      });
    }
  }

  Message.init(
    {
      chatId: DataTypes.INTEGER,
      senderId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
      type: DataTypes.ENUM("text", "image", "audio", "video"),
      content: DataTypes.TEXT,
      mediaUrl: DataTypes.STRING,
      isRead: DataTypes.BOOLEAN,
    },
    { sequelize, modelName: "Message" }
  );

  return Message;
};
