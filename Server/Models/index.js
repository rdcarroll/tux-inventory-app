const dbConfig = require("../DataAccess/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.access_token = require("./access_token.js")(sequelize);
db.customers = require("./customers.js")(sequelize);
db.employees = require("./employees.js")(sequelize);
db.event_types = require("./event_types.js")(sequelize);
db.events = require("./events.js")(sequelize);
db.inventory = require("./inventory.js")(sequelize);
db.inventory_items = require("./inventory_items.js")(sequelize);
db.inventory_types = require("./inventory_types.js")(sequelize);
db.status_types = require("./status_types.js")(sequelize);
db.packages = require("./packages.js")(sequelize);
db.package_inventory = require("./package_inventory.js")(sequelize);
db.orders = require("./orders.js")(sequelize);
db.order_items = require("./order_items.js")(sequelize);
db.order_tickets = require("./order_tickets.js")(sequelize);
db.company = require("./company.js")(sequelize);
db.payment_reasons = require("./reasons.js")(sequelize)
db.ticket_payments = require("./ticket_payments.js")(sequelize);
db.inventory_item_actions = require("./inventory_item_actions.js")(sequelize);
db.action_types = require("./action_types.js")(sequelize);
db.companies = require("./company.js")(sequelize);
db.customer_sizes = require("./customer_sizes.js")(sequelize);
db.logs = require("./logs.js")(sequelize);


db.inventory_types.hasMany(db.inventory,  { foreignKey:'InventoryTypeID', as : 'Inventory'  });
db.inventory.belongsTo(db.inventory_types, { foreignKey:'InventoryTypeID', as : 'InventoryType'  });

db.status_types.hasMany(db.inventory_items,  { foreignKey:'StatusID', as : 'InventoryItems'  });
db.inventory_items.belongsTo(db.status_types, { foreignKey:'StatusID', as : 'Status'  });

db.inventory.hasMany(db.inventory_items, { foreignKey:'InventoryID', as : 'InventoryItems' });
db.inventory_items.belongsTo(db.inventory, { foreignKey:'InventoryID', as : 'Inventory' });

db.inventory.hasMany(db.order_items, { foreignKey:'InventoryID', as : 'OrderItems' });
db.order_items.belongsTo(db.inventory, { foreignKey:'InventoryID', as : 'Inventory' });

db.customers.hasMany(db.orders, {  foreignKey:'CustomerID', as : 'Orders' });
db.orders.belongsTo(db.customers, { foreignKey:'CustomerID', as : 'Customer' });

db.inventory_items.hasMany(db.order_items, {  foreignKey:'InventoryItemID', as : 'OrderItems' });
db.order_items.belongsTo(db.inventory_items, { foreignKey:'InventoryItemID', as : 'InventoryItem' });

db.events.hasMany(db.orders, {  foreignKey:'EventID', as : 'Orders' });
db.orders.belongsTo(db.events, { foreignKey:'EventID', as : 'Event' });

db.orders.hasMany(db.order_items, {  foreignKey:'OrderID', as : 'OrderItems' });
db.order_items.belongsTo(db.orders, { foreignKey:'OrderID', as : 'Order' });

db.orders.hasMany(db.order_tickets, {  foreignKey:'OrderID', as : 'OrderTickets' });
db.order_tickets.belongsTo(db.orders, { foreignKey:'OrderID', as : 'Order' });

db.customers.hasMany(db.order_tickets, {  foreignKey:'CustomerID', as : 'OrderTickets' });
db.order_tickets.belongsTo(db.customers, { foreignKey:'CustomerID', as : 'Customer' });

db.customers.hasMany(db.customer_sizes, {  foreignKey:'CustomerID', as : 'CustomerSizes' });
db.customer_sizes.belongsTo(db.customers, { foreignKey:'CustomerID', as : 'Customer' });

db.packages.hasMany(db.package_inventory,  { foreignKey:'PackageID', as : 'PackageInventory'  });
db.package_inventory.belongsTo(db.packages, { foreignKey:'PackageID', as : 'Package'  });

db.inventory.hasMany(db.package_inventory,  { foreignKey:'InventoryID', as : 'PackageInventory'  });
db.package_inventory.belongsTo(db.inventory, { foreignKey:'InventoryID', as : 'Inventory'  });

db.order_tickets.hasMany(db.ticket_payments, {  foreignKey:'TicketID', as : 'TicketPayments' });
db.ticket_payments.belongsTo(db.order_tickets, { foreignKey:'TicketID', as : 'OrderTicket' });

db.payment_reasons.hasMany(db.ticket_payments, {  foreignKey:'ReasonID', as : 'TicketPayments' });
db.ticket_payments.belongsTo(db.payment_reasons, { foreignKey:'ReasonID', as : 'Reason' });

db.inventory_items.hasMany(db.inventory_item_actions, {  foreignKey:'InventoryItemID', as : 'InventoryItemActions' });
db.inventory_item_actions.belongsTo(db.inventory_items, { foreignKey:'InventoryItemID', as : 'InventoryItem' });

db.status_types.hasMany(db.inventory_item_actions, {  foreignKey:'ActionID', as : 'InventoryItemActions' });
db.inventory_item_actions.belongsTo(db.status_types, { foreignKey:'ActionID', as : 'Action' });

module.exports = db;