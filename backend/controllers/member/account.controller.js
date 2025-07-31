import MemberModel from "../../models/member.model.js";
import sequelize from "../../models/index.js";
import TransactionModel from "../../models/transaction.model.js";
import BookModel from "../../models/book.model.js";
import CategoryModel from "../../models/category.model.js";

const Category = CategoryModel(sequelize);
const Book = BookModel(sequelize, Category);
const Member = MemberModel(sequelize);
const Transaction=TransactionModel(sequelize,Book,Member)

export const getBorrowedBooks = async (req, res) => {
  try {
    const memberId = req.user.id;

    const borrowedBooks = await Transaction.findAll({
      where: {
        MemberID: memberId,
        ReturnDate: null
      },
      include: [
        {
          model: Book,
          attributes: ['BookID', 'Title', 'Author'] 
        }
      ]
    });

    res.status(200).json({ borrowedBooks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch borrowed books', error: error.message });
  }
};
