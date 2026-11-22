const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "ID"
    },
    ActionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ActionID"
    },
    InventoryItemID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "InventoryItemID"
    }
  };
  const options = {
    tableName: "inventory_item_actions",
    comment: "",
    indexes: []
  };
  const inventory_item_actionsModel = sequelize.define("inventory_item_actions_model", attributes, options);
  return inventory_item_actionsModel;
};