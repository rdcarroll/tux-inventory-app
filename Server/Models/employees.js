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
    LastName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "LastName"
    },
    FirstName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "FirstName"
    },
    FullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.FirstName} ${this.LastName}`;
      },
      set(value) {
        //throw new Error('Do not try to set the `fullName` value!');
      }
    },
    UserName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Username"
    },
    Email: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Email"
    },
    // Password: {
    //   type: DataTypes.STRING(200),
    //   allowNull: true,
    //   defaultValue: null,
    //   primaryKey: false,
    //   autoIncrement: false,
    //   comment: null,
    //   field: "Password"
    // },
    IsAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "IsAdmin"
    },
    IsSuperAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "IsSuperAdmin"
    }
  };
  const options = {
    tableName: "employees",
    comment: "",
    indexes: []
  };
  const EmployeesModel = sequelize.define("employees_model", attributes, options);
  return EmployeesModel;
};