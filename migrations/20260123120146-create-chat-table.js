'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      user1Id: { type: Sequelize.UUID, allowNull: false },
      user2Id: { type: Sequelize.UUID, allowNull: false },
      lastMessage: { type: Sequelize.STRING },
      lastMessageAt: { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chats');
  },
};
