import { DataTypes } from "sequelize";

const AdminModel = (sequelize) => {
  const Admin = sequelize.define("Admin", {
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
      validate: {
        isEmail: true,
      },
    },
    PasswordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin'
    }
  }, {
    tableName: "Admin", 
    timestamps: false
  });

  return Admin;
};

export default AdminModel;
