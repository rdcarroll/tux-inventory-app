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
    tableName: "action_types",
    timestamps: false,
    comment: "",
    indexes: []
  };
  const action_typesModel = sequelize.define("action_types_model", attributes, options);
  return action_typesModel;
};