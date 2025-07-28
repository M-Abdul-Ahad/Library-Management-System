import { DataTypes } from "sequelize";

const BookModel = (sequelize) => {
  const Book = sequelize.define("Book", {
    BookID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TotalCopies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AvailableCopies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'CategoryID',
      },
    },
  }, {
    tableName: "Books",
    timestamps: false,
  });
  
  return Book;
};

export default BookModel;
