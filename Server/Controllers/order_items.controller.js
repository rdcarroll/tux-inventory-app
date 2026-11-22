const model_service = require(`../Services/OrderItemService`);
const orderticket_service = require(`../Services/OrderTicketService`);
const invitem_service = require(`../Services/InventoryItemService`);
const model_name = `OrderItem`;

// Create and Save a new Record
exports.create = async (req, res) => {
  let response;
  let nModel = req.body;
  nModel['EmployeeID'] = req.user.id;
  try {
    response = await model_service.create(nModel);
    //update ticket
    await orderticket_service.syncOrder(nModel.OrderID);
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
      message: `Error retrieving ${model_name}s`
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
    //update ticket
    await orderticket_service.syncOrder(uModel.OrderID);
    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error updating ${model_name}.`
    });
  }
};

// Delete an order item with the specified id in the request
exports.delete = async (req, res) => {
  let response;
  const id = req.params.id;
  try {
    response = await model_service.remove(id);
    //update ticket
    await orderticket_service.syncOrder(response.OrderID);
    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error deleting ${model_name}`
    });
  }
};

exports.pull = async (req, res) => {
  let response;
  const id = req.params.id;
  const now = new Date();
  let uModel = req.body;
  uModel.pulledDate = now;
  try {
    response = await model_service.update(id, uModel);
    //await model_service.update(id, {Confirmed:true});
    let dpull = await invitem_service.pullitem(uModel.InventoryItemID);

    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error pulling ${model_name}.`
    });
  }
};
exports.return = async (req, res) => {
  let response;
  const id = req.params.id;
  const now = new Date();
  let uModel = req.body;
  uModel.returnedDate = now;
  let oInventoryItemID = uModel.InventoryItemID;
  try {

    //either return to shelf, or return as order item
    if(req.query.remove){
      uModel.InventoryItemID=null;
      uModel.pickedupDate=null;
      uModel.pulledDate=null;
      uModel.returnedDate=null;
    }
    
    response = await model_service.update(id, uModel);
    let dreturn = await invitem_service.returnitem(oInventoryItemID);

    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error returning ${model_name}.`
    });
  }
};

