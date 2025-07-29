import { DataTypes } from 'sequelize';

const TransactionModel = (sequelize, Book, Member) => {
  const Transaction = sequelize.define('Transaction', {
    TransactionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    BookID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Books',
        key: 'BookID',
      },
    },
    MemberID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Members',
        key: 'MemberID',
      },
    },
    IssueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    DueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ReturnDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,  
    },
  }, {
    tableName: 'Transactions',
    timestamps: false,
  });

   if (Book) {
    Transaction.belongsTo(Book, { foreignKey: "BookID" });
  }
  if (Member) {
    Transaction.belongsTo(Member, { foreignKey: "MemberID" });
  }

  return Transaction;
};

export default TransactionModel;
