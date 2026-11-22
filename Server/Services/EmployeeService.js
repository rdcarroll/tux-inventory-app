const db = require("../Models");
const Model = db.employees;

module.exports = {
    getAll: getAll,
    getOne: getOne,
    create: create,
    update: update
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
    delete record.Password;
    return await Model.create(record);
  } catch (err) {
    throw err;
  }
}
async function update(id,record) {
  try {
    delete record.Password;
    return await Model.update(record, {
      where: {
        ID: id
      }
    });
  } catch (err) {
    throw err;
  }
}