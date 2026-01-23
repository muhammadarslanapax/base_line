'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'deviceToken', {
      type: Sequelize.STRING,
      allowNull: true, // user may not have registered a device yet
      defaultValue: null,
      comment: "Device token for push notifications",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'deviceToken');
  }
};
