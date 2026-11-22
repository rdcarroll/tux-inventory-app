const model_service = require(`../Services/EmployeeService`);
const model_name = `Employee`;

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
  let curUserID = req.user.id;
  try {
    //dont update your own usrname or admin checkbox
    let curUser = await model_service.getOne({where:{ID:curUserID}});
    if(curUserID == curUser.UserName){
      uModel.IsAdmin = curUser.IsAdmin;
      uModel.UserName = curUser.UserName;
    }
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

exports.findMe = async (req, res) => {
  let response;
  const userID = req.authedID;
  if(req.query.where)req.query.where['ID']=userID;
        try {
          response = await model_service.getOne(req.query);
          res.json(response);
        } catch (err) {
          res.status(500).send({
            message: `Error retrieving ${model_name}`
          });
        }
};

