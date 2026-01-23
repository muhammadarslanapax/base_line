// booking.model.js
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "in-progress", "completed", "cancelled"),
      defaultValue: "pending",
    },
    bookedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,   // ✅ FIXED
    }
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: "userId" });
    Booking.belongsTo(models.Business, { foreignKey: "businessId" });
    Booking.belongsTo(models.Service, { foreignKey: "serviceId" });
  };

  return Booking;
};
