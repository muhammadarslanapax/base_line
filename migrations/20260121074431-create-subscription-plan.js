'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SubscriptionPlans', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      durationMonths: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      pricePerMonth: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      isBestValue: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SubscriptionPlans');
  }
};
