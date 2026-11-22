const model_service = require(`../Services/StatusTypeService`);
const model_name = `StatusType`;

// Create and Save a new Record
exports.create = async (req, res) => {
  let response;
  let nModel = req.body;
  try {
    response = await model_service.create(nModel);
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
    res.json(response);
  } catch (err) {
    res.status(500).send({
      message: `Error updating ${model_name}.`
    });
  }
};

// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
  
};
