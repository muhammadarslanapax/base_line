"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChatParticipant extends Model {
    static associate(models) {
      ChatParticipant.belongsTo(models.Chat, { foreignKey: "chatId" });
      ChatParticipant.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  ChatParticipant.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      chatId: DataTypes.UUID,
      userId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "ChatParticipant",
    }
  );

  return ChatParticipant;
};
