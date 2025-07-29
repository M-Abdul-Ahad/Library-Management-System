import { Op, Sequelize } from "sequelize";
import sequelize from "../../models/index.js";
import dayjs from "dayjs"; 
import BookModel from "../../models/book.model.js";
import BookRequestModel from "../../models/bookRequest.model.js";
import TransactionModel from "../../models/transaction.model.js";
import MemberModel from "../../models/member.model.js";
import CategoryModel from "../../models/category.model.js";

const Category=CategoryModel(sequelize)
const Book = BookModel(sequelize,Category);
const Member = MemberModel(sequelize);
const Transaction=TransactionModel(sequelize,Book,Member)
const BookRequest=BookRequestModel(sequelize,Book,Member)



export const issueBook = async (req, res) => {
  try {
    const { requestId } = req.body;

    const bookRequest = await BookRequest.findOne({
      where: {
        RequestID: requestId,
        RequestType: "borrow",
        Status: "pending",
      },
    });

    if (!bookRequest) {
      return res.status(404).json({ message: "Borrow request not found or already processed." });
    }

    const { MemberID, BookID, DaysToBorrow, RequestDate } = bookRequest;

    const book = await Book.findByPk(BookID);
    const member = await Member.findByPk(MemberID);
    if (!book || !member) {
      return res.status(404).json({ message: "Book or Member not found." });
    }

    const alreadyIssued = await Transaction.findOne({
      where: {
        BookID,
        ReturnDate: null,
      },
    });

    if (alreadyIssued) {
      return res.status(400).json({ message: "Book is already issued and not returned yet." });
    }

    const issueDate = dayjs().format("YYYY-MM-DD");
    const dueDate = dayjs(issueDate).add(DaysToBorrow || 14, "day").format("YYYY-MM-DD"); 

    const transaction = await Transaction.create({
      BookID,
      MemberID,
      IssueDate: issueDate,
      DueDate: dueDate,
      ReturnDate: null,
    });

    await bookRequest.update({
      Status: "approved",
      AdminResponseDate: dayjs().format("YYYY-MM-DD"),
    });

    return res.status(201).json({
      message: "Book issued successfully.",
      transaction,
    });

  } catch (error) {
    console.error("Error issuing book:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
