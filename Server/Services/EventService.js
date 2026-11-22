const db = require("../Models");
const Model = db.events;

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
  } catch (err) {
    throw err;
  }
}