const model_service = require(`../Services/InventoryService`);
const model_name = `Inventory`;

// Create and Save a new Record
exports.create = async (req, res) => {
  let response;
  let nModel = req.body;
  try {
    response = await model_service.create(nModel);
    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error creating ${model_name} : ${err.message}`
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
      message: `Error retrieving ${model_name}s : ${err.message}`
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
      message: `Error retrieving ${model_name} : ${err.message}`
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
      message: `Error updating ${model_name} : ${err.message}.`
    });
  }
};

// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
  
};
