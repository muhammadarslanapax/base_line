'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('Businesses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),

        
            },
     
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId:{
        type: Sequelize.UUID,
        allowNull: false,
        references:{
          model:"Users",
          key:"id"
        }
      },
      
     
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoryIds: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: false,
      },
      paymentMethodIds: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },

     
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Businesses');
  }
};