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
      autoIncrement: false,
      comment: null,
      field: "ID"
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "CustomerID"
    },
    EventID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "EventID"
    }
  };
  const options = {
    tableName: "event_customers",
    comment: "",
    indexes: []
  };
  const EventCustomersModel = sequelize.define("event_customers_model", attributes, options);
  return EventCustomersModel;
};