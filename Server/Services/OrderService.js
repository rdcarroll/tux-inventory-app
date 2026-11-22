const db = require("../Models");
const Model = db.orders;

module.exports = {
    getAll: getAll,
    getOne: getOne,
    create: create,
    update: update,
    remove: remove

};
async function getAll(query) {
    try {
      return await Model.findAndCountAll(query);
    } catch (err) {
      throw err;
    }
}
async function getOne(query) {
    try {
      let id = query.where.ID;
      return await Model.findByPk(id,query);
    } catch (err) {
      throw err;
    }
}

async function create(record) {
  try {
    const model = await Model.create(record);

     //create new ticket
     await db.order_tickets.create({
      OrderID:model.ID,
      SubTotal:0,
      Total:0,
      Tax:0,
      Adjustment:0,
      CustomerID:model.CustomerID,
    });
    //create default inv items list for order
    const dInv = await db.inventory.findAll({where:{ModelName:"default"}, include:["InventoryType"], order:[["InventoryType","Rank","ASC"]]});
    for (const di of dInv) {
      const dInvItems = await db.inventory_items.findAll({limit:1, where:{InventoryID:di.ID}});
      for (const dii of dInvItems) {
        await db.order_items.create({
          OrderID:model.ID,
          CustomerID:model.CustomerID,
          EmployeeID:record.EmployeeID, 
          InventoryID:di.ID,
          //InventoryItemID:dii.ID,
          ItemSize: dii.Size,
          StatusID:2,
          Cost:0,
          Confirmed:false
        });
      }
     }

    return model;
  } catch (err) {
    throw err;
  }
}
async function update(id,record) {
  try {
    return await Model.update(record, {
      where: {
        ID: id
      }
    });
  } catch (err) {
    throw err;
  }
}
async function remove(id) {
  try {
    const orderItemsModel = db.order_items;
    const ticketModel = db.order_tickets;
    const paymentModel = db.ticket_payments;

    const order = await Model.findByPk(id);
    const tickets = await ticketModel.findAll({where:{OrderID:order.ID}});

    for (const t of tickets) {
      const tpModels = await paymentModel.destroy({where:{TicketID:t.ID}});
    }
    //remove child elements
    const oiModels = await orderItemsModel.destroy({where:{OrderID:order.ID}});
    const otModels = await ticketModel.destroy({where:{OrderID:order.ID}});
    return await order.destroy();
  } catch (err) {
    throw err;
  }
}
async function getOrderItems(id) {
    try {
      return await Model.findAll();
    } catch (err) {
      throw err;
    }
}