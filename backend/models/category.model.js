import { DataTypes } from "sequelize";

const CategoryModel = (sequelize) => {
  const Category = sequelize.define("Category", {
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CategoryDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: "Categories",
    timestamps: false,
  });

  return Category;
};

export default CategoryModel;
