const db = require("../Models");
const Model = db.inventory_items;
const { Op, Sequelize } = require("sequelize");

module.exports = {
    getAll: getAll,
    getOne: getOne,
    create: create,
    update: update,
    checkBooking:checkBooking,
    pullitem:pullitem,
    returnitem:returnitem,
    actionitem:actionitem,
    getAllSizes:getAllSizes
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
    return await Model.create(record);
  } catch (err) {
    throw err;
  }
}
async function update(id,record) {
  try {
    let updated = await Model.update(record, {
      where: {
        ID: id
      }
    });
    return updated;
  } catch (err) {
    throw err;
  }
}


async function getAllSizes(query) {
  try {
    return await Model.findAll({attributes: ['InventoryID', 'Size'], group: ['InventoryID', 'Size'], where:query.where});
    //return await Model.findAll({Attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Size')), 'Size'], 'InventoryID'], where:query.where});
    //return await Model.findAll({attributes: ['InventoryID', 'Size'], where:query.where});
  } catch (err) {
    throw err;
  }
}
async function checkBooking(orderid, items){
  try {
    for (const item of items) {
      let order = await db.orders.findByPk(orderid);
      const startDate = new Date(order.pickUpDate);
      const endDate = new Date(order.returnDate);
        let bookings = await db.order_items.findAll(
          {
            include:[{association:'Order'},{association:'InventoryItem'}],
            where:{
            [Op.and]: [
              { InventoryItemID:item.ID },
              { '$InventoryItem.Barcode$': { [Op.ne]:null } },
              { '$Order.pickUpDate$': { [Op.lte]:endDate } },
              {'$Order.returnDate$': { [Op.gte]: startDate } }
            ]
          }} );
        item.overbooked=bookings.length>1;
    }
    return items;
  } catch (error) {
    throw error;
  }
}

async function pullitem(id) {
  try {
    await db.inventory_item_actions.create({InventoryItemID:id,ActionID:6});
    let record = {StatusID:6}
    return await Model.update(record, {
      where: {
        ID: id
      }
    });
  } catch (err) {
    throw err;
  }
}
async function returnitem(id) {
  try {
    await db.inventory_item_actions.create({InventoryItemID:id,ActionID:2});
    let record = {StatusID:2}
    return await Model.update(record, {
      where: {
        ID: id
      }
    });
  } catch (err) {
    throw err;
  }
}
//TODO: something more generic than hardcoded status ids
async function actionitem(id, status) {
  try {
    //TODO: Add orderid to table so we can track it back to a customer if it is an order action
    await db.inventory_item_actions.create({InventoryItemID:id,ActionID:status});
    let record = {StatusID:status}
    return await Model.update(record, {
      where: {
        ID: id
      }
    });
  } catch (err) {
    throw err;
  }
}
