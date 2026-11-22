const model_service = require(`../Services/OrderService`);
const orderitem_service = require(`../Services/OrderItemService`);
const orderticket_service = require(`../Services/OrderTicketService`);
const invitem_service = require(`../Services/InventoryItemService`);

const model_name = `Order`;

// Create and Save a new Record
exports.create = async (req, res) => {
  let response;
  let nModel = req.body;
  nModel['EmployeeID'] = req.user.id;
  try {
    response = await model_service.create(nModel);
    //update ticket
    await orderticket_service.syncOrder(response.ID);

    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error creating ${model_name}`
    });
  }
};

// Retrieve all Records from the database
exports.findAll = async (req, res) => {
  let response;
  try {
    response = await model_service.getAll(req.query);
    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving ${model_name}s:${err.message}`
    });
  }
};

// Find a single Record with an ID
exports.findOne = async (req, res) => {
  let response;
  const id = req.params.id;
  if(req.query.where)req.query.where['ID']=id;
  try {
    response = await model_service.getOne(req.query);
    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving ${model_name}`
    });
  }
};

// Update a Record by the ID in the request
exports.update = async (req, res) => {
  let response;
  const id = req.params.id;
  let uModel = req.body;
  try {
    response = await model_service.update(id, uModel);
    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error updating ${model_name}.`
    });
  }
};


exports.delete = async (req, res) => {
  let response;
  const id = req.params.id;
  try {
    response = await model_service.remove(id);
    //todo: remove/deactivate all child items
    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error deleting ${model_name}`
    });
  }
};

exports.findItems = async (req, res) => {
  let response;
  const id = req.params.id;
  if(req.query.where)req.query.where['OrderID']=id;
  req.query['raw']=true;
  req.query['nest']=true;
  try {
    response = await orderitem_service.getAll(req.query);
    let verified = await orderitem_service.checkBooking(response);
    res.json(verified);
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving ${model_name}:${err.message}`
    });
  }
};
exports.replaceItems = async (req, res) => {
  let response;
  const id = req.params.id;
  if(req.query.where)req.query.where['OrderID']=id;
  req.query['EmployeeID'] = req.user.id;
  try {
    response = await orderitem_service.replace(id,req.query);
    //update ticket
    await orderticket_service.syncOrder(id);
    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving ${model_name}:${err.message}`
    });
  }
};

exports.pickup = async (req, res) => {
  const now = new Date();
  const id = req.params.id;
  if(req.query.where)req.query.where['OrderID']=id;
  try {
    orderItems = await orderitem_service.getAll(req.query);
    for (const orderItem of orderItems) {
      let a = await orderitem_service.update(orderItem.ID, {pickedupDate:now});
      //get InventoryItemID or InventoryItem, and add the action
      let dpull = await invitem_service.actionitem(orderItem.InventoryItemID,3);
    }
    
    res.json(orderItems);
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving ${model_name}:${err.message}`
    });
  }
};

