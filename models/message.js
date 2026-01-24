'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Chat, { foreignKey: 'chatId', as: 'chat' });
      Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
      Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
    }
  }

  Message.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      chatId: { type: DataTypes.UUID, allowNull: false },
      senderId: { type: DataTypes.UUID, allowNull: false },
      receiverId: { type: DataTypes.UUID, allowNull: false },
      type: { type: DataTypes.ENUM('text','audio','video','image'), allowNull: false },
      content: DataTypes.TEXT,
      mediaUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'Messages',
    }
  );

  return Message;
};
