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
    Name: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Name"
    }
  };
  const options = {
    tableName: "payment_reasons",
    timestamps: false,
    comment: "",
    indexes: []
  };
  const payment_reasonsModel = sequelize.define("payment_reasons_model", attributes, options);
  return payment_reasonsModel;
};