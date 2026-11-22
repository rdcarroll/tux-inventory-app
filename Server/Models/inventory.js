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
    InventoryTypeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "InventoryTypeID"
    },
    Description: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Description"
    },
    ModelName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ModelName"
    },
    ModelWDesc: {
      type: DataTypes.VIRTUAL,
      get() {
        //let desc = this.ModelName!=this.Description? ` (${this.Description})` : '';
        return `${this.ModelName} (${this.InventoryType?this.InventoryType.Name:""})`;
      },
      set(value) {
        //throw new Error('Do not try to set the `fullName` value!');
      }
    },
    Cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Cost"
    }
  };
  const options = {
    tableName: "inventory",
    comment: "",
    indexes: []
  };
  const InventoryModel = sequelize.define("inventory_model", attributes, options);
  return InventoryModel;
};