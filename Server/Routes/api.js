
module.exports = (router, app) => {
  const employees = require("../Controllers/employees.controller.js");
  router.get("/employees", app.oauth.authorise(), employees.findAll);
  router.get("/employees/Me", app.oauth.authorise(), employees.findMe);
  router.get("/employees/:id", app.oauth.authorise(), employees.findOne);
  router.put("/employees/:id", app.oauth.authorise(), employees.update);
  router.post("/employees", app.oauth.authorise(), employees.create);

  const customers = require("../Controllers/customers.controller.js");
  router.get("/customers", app.oauth.authorise(), customers.findAll);
  router.get("/customers/:id", app.oauth.authorise(), customers.findOne);
  router.put("/customers/:id", app.oauth.authorise(), customers.update);
  router.post("/customers", app.oauth.authorise(), customers.create);

  const customer_sizes = require("../Controllers/customer_sizes.controller.js");
  router.get("/customer_sizes", app.oauth.authorise(), customer_sizes.findAll);
  router.get("/customer_sizes/:id", app.oauth.authorise(), customer_sizes.findOne);
  router.put("/customer_sizes/:id", app.oauth.authorise(), customer_sizes.update);
  router.post("/customer_sizes", app.oauth.authorise(), customer_sizes.create);

  const events = require("../Controllers/events.controller.js");
  router.get("/events", app.oauth.authorise(), events.findAll);
  router.get("/events/:id", app.oauth.authorise(), events.findOne);
  router.put("/events/:id", app.oauth.authorise(), events.update);
  router.post("/events", app.oauth.authorise(), events.create);
  router.delete("/events/:id", app.oauth.authorise(), events.delete);

  const event_types = require("../Controllers/event_types.controller.js");
  router.get("/event_types", app.oauth.authorise(), event_types.findAll);
  router.get("/event_types/:id", app.oauth.authorise(), event_types.findOne);
  router.put("/event_types/:id", app.oauth.authorise(), event_types.update);
  router.post("/event_types", app.oauth.authorise(), event_types.create);

  const inventory = require("../Controllers/inventory.controller.js");
  router.get("/inventory", app.oauth.authorise(), inventory.findAll);
  router.get("/inventory/:id", app.oauth.authorise(), inventory.findOne);
  router.put("/inventory/:id", app.oauth.authorise(), inventory.update);
  router.post("/inventory", app.oauth.authorise(), inventory.create);

  const inventory_items = require("../Controllers/inventory_items.controller.js");
  router.get("/inventory_items", app.oauth.authorise(), inventory_items.findAll);
  router.get("/inventory_items/export", inventory_items.export);
  router.get("/inventory_items/:id", app.oauth.authorise(), inventory_items.findOne);
  router.put("/inventory_items/:id", app.oauth.authorise(), inventory_items.update);
  router.post("/inventory_items", app.oauth.authorise(), inventory_items.create);
  router.get("/inventory/:id/sizes", app.oauth.authorise(), inventory_items.findSizes);
  router.post("/inventory_items/:id/actions", app.oauth.authorise(), inventory_items.addAction);

  const inventory_types = require("../Controllers/inventory_types.controller.js");
  router.get("/inventory_types", app.oauth.authorise(), inventory_types.findAll);
  router.get("/inventory_types/:id", app.oauth.authorise(), inventory_types.findOne);
  router.put("/inventory_types/:id", app.oauth.authorise(), inventory_types.update);
  router.post("/inventory_types", app.oauth.authorise(), inventory_types.create);
  
  const status_types = require("../Controllers/status_types.controller.js");
  router.get("/status_types", app.oauth.authorise(), status_types.findAll);
  router.get("/status_types/:id", app.oauth.authorise(), status_types.findOne);
  router.put("/status_types/:id", app.oauth.authorise(), status_types.update);
  router.post("/status_types", app.oauth.authorise(), status_types.create);
  
  const packages = require("../Controllers/packages.controller.js");
  router.get("/packages", app.oauth.authorise(), packages.findAll);
  router.get("/packages/:id", app.oauth.authorise(), packages.findOne);
  router.put("/packages/:id", app.oauth.authorise(), packages.update);
  router.post("/packages", app.oauth.authorise(), packages.create);

  const package_inventory = require("../Controllers/package_inventory.controller.js");
  router.get("/package_inventory", app.oauth.authorise(), package_inventory.findAll);
  router.get("/package_inventory/:id", app.oauth.authorise(), package_inventory.findOne);
  router.put("/package_inventory/:id", app.oauth.authorise(), package_inventory.update);
  router.post("/package_inventory", app.oauth.authorise(), package_inventory.create);

  const orders = require("../Controllers/orders.controller.js");
  router.get("/orders", app.oauth.authorise(), orders.findAll);
  router.get("/orders/:id", app.oauth.authorise(), orders.findOne);
  router.post("/orders", app.oauth.authorise(), orders.create);
  router.put("/orders/:id", app.oauth.authorise(), orders.update);
  router.delete("/orders/:id", app.oauth.authorise(), orders.delete);
  router.put("/orders/:id/pickup", app.oauth.authorise(), orders.pickup);
  
  const order_items = require("../Controllers/order_items.controller.js");
  router.get("/orders/:id/order_items", app.oauth.authorise(), orders.findItems);
  router.put("/orders/:id/order_items", app.oauth.authorise(), orders.replaceItems);
  router.post("/order_items", app.oauth.authorise(), order_items.create);
  router.put("/order_items/:id", app.oauth.authorise(), order_items.update);
  router.delete("/order_items/:id", app.oauth.authorise(), order_items.delete);
  router.put("/order_items/:id/pull", app.oauth.authorise(), order_items.pull);
  router.put("/order_items/:id/return", app.oauth.authorise(), order_items.return);
  
  const order_tickets = require("../Controllers/order_tickets.controller.js");
  router.get("/order_tickets", app.oauth.authorise(), order_tickets.findAll);
  router.get("/order_tickets/:id", app.oauth.authorise(), order_tickets.findOne);
  router.put("/order_tickets/:id", app.oauth.authorise(), order_tickets.update);
  router.delete("/order_tickets/:id", app.oauth.authorise(), order_tickets.delete);
  router.post("/order_tickets", app.oauth.authorise(), order_tickets.create);
  
  const ticket_payments = require("../Controllers/ticket_payments.controller.js");
  router.get("/payment_reasons", app.oauth.authorise(), ticket_payments.findAllReasons);
  router.get("/ticket_payments", app.oauth.authorise(), ticket_payments.findAll);
  router.get("/ticket_payments/:id", app.oauth.authorise(), ticket_payments.findOne);
  router.put("/ticket_payments/:id", app.oauth.authorise(), ticket_payments.update);
  router.delete("/ticket_payments/:id", app.oauth.authorise(), ticket_payments.delete);
  router.post("/ticket_payments", app.oauth.authorise(), ticket_payments.create);

  const companies = require("../Controllers/companies.controller.js");
  router.get("/companies", app.oauth.authorise(), companies.findAll);
  router.get("/companies/:id", app.oauth.authorise(), companies.findOne);
  router.put("/companies/:id", app.oauth.authorise(), companies.update);
  router.post("/companies", app.oauth.authorise(), companies.create);

  const logs = require("../Controllers/logs.controller.js");
  router.get("/logs", app.oauth.authorise(), logs.findAll);
  router.get("/logs/:id", app.oauth.authorise(), logs.findOne);
  router.post("/logs", app.oauth.authorise(), logs.create);

  
  const maintenance = require("../Controllers/maintenance.controller.js");
  router.get("/importcustomers",  maintenance.importcustomers);
  router.get("/importinventory",  maintenance.importinventory);
  router.get("/testinventory",  maintenance.testinventory);

  return router;
};
