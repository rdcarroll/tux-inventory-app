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
    TicketID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "TicketID"
    },
    ReasonID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ReasonID"
    },
    Amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Amount"
    }
  };
  const options = {
    tableName: "ticket_payments",
    comment: "",
    indexes: []
  };
  const ticket_paymentsModel = sequelize.define("ticket_payments_model", attributes, options);
  return ticket_paymentsModel;
};