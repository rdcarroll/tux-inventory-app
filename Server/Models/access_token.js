const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    access_token: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "access_token"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "user_id"
    },
    refresh_token: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "refresh_token"
    }
  };
  const options = {
    tableName: "access_tokens",
    timestamps: false,
    comment: "",
    indexes: []
  };
  const AccessTokensModel = sequelize.define("access_tokens_model", attributes, options);
  return AccessTokensModel;
};