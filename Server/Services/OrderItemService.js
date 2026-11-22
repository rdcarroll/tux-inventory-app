const db = require("../Models");
const Model = db.order_items;
const { Op } = require("sequelize");

module.exports = {
    getAll: getAll,
    getOne: getOne,
    create: create,
    update: update,
    remove: remove,
    replace: replace,
    checkBooking:checkBooking
};
async function getAll(query) {
    try {
      return await Model.findAll(query);
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
    //if we're adding a new item, grab first default 
    const dInv = await db.inventory_items.findAll({where:{"$Inventory.ModelName$":"default"}, limit:1, include:['Inventory']});
    record.InventoryID = dInv[0].InventoryID;
    record.ItemSize = "";
    record.Confirmed = false;
    
    return await Model.create(record);
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
    const model = await Model.findByPk(id);
    return await model.destroy();
    //TODO: redo ticket
  } catch (err) {
    throw err;
  }
}

async function replace(id,query) {
  try {
    const pacakge_id = query['package_id'];
    const EmployeeID = query['EmployeeID'];
    const packageInventory = await db.package_inventory.findAll({where:{PackageID:pacakge_id}, include:[{association:'Inventory',include:[{association:'InventoryItems',limit:1}]}]});
    //TODO: look for inventory items without conflict as first choice
    if(packageInventory.length>0){
      const order = await db.orders.findByPk(id);
      await db.order_items.destroy({where:query.where});

      for (const pi of packageInventory) {
        await db.order_items.create({
          OrderID:order.ID,
          CustomerID:order.CustomerID,
          Confirmed:0,
          Cost:pi.Inventory.Cost,
          EmployeeID:EmployeeID,
          InventoryID:pi.Inventory.ID,
          ItemSize:pi.Inventory.InventoryItems[0].Size||""
        });
      }
    }
    return await db.order_items.findAll({where:query.where});
 
    //TODO: redo ticket
  } catch (err) {
    throw err;
  }
}

//item has OrderItem ID and ItemSize, at least
//count matching sizes for inventory model
//count how many are checked out over time period
async function checkBooking(items){
  try {
    for (var item of items) {
      //get the order from the actual order item
      let order_item = await db.order_items.findByPk(item.ID,{include:['Order']});
      const startDate = new Date(order_item.Order.pickUpDate);
      const endDate = new Date(order_item.Order.returnDate);
        let available = await db.inventory_items.findAll(
          {
            where:{
            [Op.and]: [
              { InventoryID:order_item.InventoryID },
              { Size: item.ItemSize },
              // { '$Order.pickUpDate$': { [Op.lte]:endDate } },
              // {'$Order.returnDate$': { [Op.gte]: startDate } }
            ]
          }} );
          let bookings = await Model.findAll(
            {
              include:[{association:'Order'}],
              where:{
              [Op.and]: [
                { InventoryID:order_item.InventoryID },
                { ItemSize: item.ItemSize },
                { '$Order.pickUpDate$': { [Op.lte]:endDate } },
                {'$Order.returnDate$': { [Op.gte]: startDate } }
              ]
            }} );
        item.overbooked=(available.length - bookings.length) < 0;
    }
    return items;
  } catch (error) {
    throw error;
  }
}