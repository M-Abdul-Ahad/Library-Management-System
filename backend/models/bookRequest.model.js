import { DataTypes } from "sequelize";

const BookRequestModel = (sequelize, Book, Member) => {
  const BookRequest = sequelize.define("BookRequest", {
    RequestID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MemberID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Members",
        key: "MemberID",
      },
    },
    BookID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Books", 
        key: "BookID",
      },
    },
    RequestType: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [["borrow", "return"]],
      },
    },
    DaysToBorrow: {
      type: DataTypes.INTEGER,
      allowNull: true, 
    },
    Status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [["pending", "approved", "rejected"]],
      },
    },
    RequestDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    AdminResponseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  }, {
    tableName: "BookRequests",
    timestamps: false,
  });

  if (Book) {
    BookRequest.belongsTo(Book, { foreignKey: "BookID" });
  }
  if (Member) {
    BookRequest.belongsTo(Member, { foreignKey: "MemberID" });
  }

  return BookRequest;
};

export default BookRequestModel;
