const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const path = require('path');

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.restaurant = require("./restaurant.model.js")(sequelize, Sequelize);
db.dish = require('./dish.model.js')(sequelize, Sequelize);
db.order = require('./order.model.js')(sequelize, Sequelize);
db.orderItem = require('./orderItem.model.js')(sequelize, Sequelize);

// Définition des associations
db.user.hasMany(db.restaurant, { foreignKey: 'userId' });
db.restaurant.belongsTo(db.user, { foreignKey: 'userId' });

db.restaurant.hasMany(db.dish);
db.dish.belongsTo(db.restaurant);

db.restaurant.hasMany(db.order);
db.order.belongsTo(db.restaurant);

db.user.hasMany(db.order);
db.order.belongsTo(db.user);

// Associations pour OrderItem
db.order.hasMany(db.orderItem);
db.orderItem.belongsTo(db.order);

db.dish.hasMany(db.orderItem);
db.orderItem.belongsTo(db.dish);

module.exports = db;
