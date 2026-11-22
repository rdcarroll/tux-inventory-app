
const db = require("../Models");
const order_tickets = require("../Models/order_tickets");
const Model = db.order_tickets;

module.exports = {
    getAll: getAll,
    getOne: getOne,
    create: create,
    update: update,
    syncOrder: syncOrder,
    syncOrderByTicket: syncOrderByTicket
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
async function syncOrderByTicket(id) {
  try {
    let orderTickets = await db.order_tickets.findAll({where: {ID: id}});
    
    for (const item of orderTickets) {
      await syncOrder(item.OrderID);
    }
    return;
  } catch (err) {
    throw err;
  }
}
async function syncOrder(id) {
  try {
    let order = await db.orders.findByPk(id);
    let company = await db.company.findAll();
    let orderTickets = await db.order_tickets.findAll({where: {OrderID: order.ID }});
    let ot;
    if(orderTickets.length==0){
      //create new ticket
      ot = await db.order_tickets.create({
       OrderID:order.ID,
       SubTotal:0,
       Total:0,
       Tax:0,
       Adjustment:0,
       Balance:0,
       CustomerID:order.CustomerID,
     });
    }
    else{
      ot = orderTickets[0];
    }

    //update ticket
    let update = {Adjustment:0, Tax:0, SubTotal:0,Total:0, Paid:0, Balance:0};
    let orderItems = await db.order_items.findAll({where: {OrderID: order.ID }});
    for (const item of orderItems) {
      update.SubTotal += (item.Cost||0);
    }
    update.Adjustment = parseFloat(ot.Adjustment)||0;

    let sa_total =  update.Adjustment + update.SubTotal;

    if(company.length>0) update.Tax = sa_total * (company[0].TaxRate||.10);

    update.Total = sa_total + update.Tax;

    let ticketPayments = await db.ticket_payments.findAll({where: {TicketID: ot.ID }});
    for (const item of ticketPayments) {
      update.Paid += (item.Amount||0);
    }

    update.Balance = update.Total - update.Paid;
    
    return await Model.update(update, {
      where: {
        ID: ot.ID
      }
    });

  } catch (err) {
    throw err;
  }
}