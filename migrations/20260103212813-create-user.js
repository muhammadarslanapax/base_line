module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,

      },
      uid: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      role: {
        type: Sequelize.ENUM("user", "business","admin"),
        allowNull: false
      },
      method: {
        type: Sequelize.ENUM("email", "google", "facebook", "apple"),
        allowNull: false
      },

      
      country: Sequelize.STRING,
      accessToken: Sequelize.TEXT,

      city: Sequelize.STRING,
      image: Sequelize.STRING,

      name: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      password: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
