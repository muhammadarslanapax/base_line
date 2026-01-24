'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.hasMany(models.Message, { as: 'messages', foreignKey: 'chatId' });
      Chat.belongsTo(models.User, { as: 'user1', foreignKey: 'user1Id' });
      Chat.belongsTo(models.User, { as: 'user2', foreignKey: 'user2Id' });
    }
  }
  Chat.init(
    {
      user1Id: { type: DataTypes.UUID, allowNull: false },
      user2Id: { type: DataTypes.UUID, allowNull: false },
      lastMessage: { type: DataTypes.STRING },
      lastMessageAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: 'Chat',
      tableName: 'Chats', // <-- important
      freezeTableName: true, // disables pluralization
    }
  );
  return Chat;
};
