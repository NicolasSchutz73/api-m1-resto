module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define("orderItem", {
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  });

  return OrderItem;
};
