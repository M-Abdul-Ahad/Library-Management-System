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

    const issueDate = dayjs().format("YYYY-MM-DD");
    const dueDate = dayjs(issueDate).add(DaysToBorrow || 14, "day").format("YYYY-MM-DD"); 

    const transaction = await Transaction.create({
      BookID,
      MemberID,
      IssueDate: issueDate,
      DueDate: dueDate,
      ReturnDate: null,
    });

    book.AvailableCopies -= 1;
    await book.save();

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

export const rejectIssueRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required." });
    }

    const bookRequest = await BookRequest.findOne({
      where: { RequestID: requestId, Status: "pending" },
    });

    if (!bookRequest) {
      return res.status(404).json({
        message: "Book request not found or already processed.",
      });
    }

    await bookRequest.update({
      Status: "rejected",
      AdminResponseDate: dayjs().format("YYYY-MM-DD"),
    });

    return res.status(200).json({
      message: "Issue request rejected successfully.",
    });
  } catch (error) {
    console.error("Error in rejecting issue request:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const acceptBookReturn = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required." });
    }

    const bookRequest = await BookRequest.findOne({
      where: { RequestID: requestId, Status: "pending", RequestType: "return" },
    });

    if (!bookRequest) {
      return res.status(404).json({ message: "Book request not found or already processed." });
    }

    const { MemberID, BookID } = bookRequest;

    const book = await Book.findByPk(BookID);
    const member = await Member.findByPk(MemberID);

    if (!book || !member) {
      return res.status(404).json({ message: "Book or Member not found." });
    }

    const transaction = await Transaction.findOne({
      where: {
        BookID,
        MemberID,
        ReturnDate: null,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Active transaction not found." });
    }

    const today = dayjs();
    const dueDate = dayjs(transaction.DueDate);
    const overdueDays = today.diff(dueDate, "day");

    const fineAmount = overdueDays > 0 ? overdueDays * 50 : 0;

    await transaction.update({
      ReturnDate: today.format("YYYY-MM-DD"),
      Fine: fineAmount,
    });

    await bookRequest.update({
      Status: "approved",
      AdminResponseDate: dayjs().format("YYYY-MM-DD"),
    });

    book.AvailableCopies += 1;
    await book.save();

    return res.status(200).json({ message: "Book return accepted successfully." ,fine: fineAmount});
  } catch (error) {
    console.error("Error in accepting book return:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllBorrowRequests = async (req, res) => {
  try {
    const requests = await BookRequest.findAll({
      where: {
        RequestType: "borrow",
      },
      order: [["RequestDate", "DESC"]],
      include: [
        { model: Book, attributes: ["Title", "BookID"] },
        { model: Member, attributes: ["MemberName", "MemberID"] },
      ],
    });

    return res.status(200).json({ borrowRequests: requests });
  } catch (error) {
    console.error("Error fetching borrow requests:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllReturnRequests = async (req, res) => {
  try {
    const requests = await BookRequest.findAll({
      where: {
        RequestType: "return",
      },
      order: [["RequestDate", "DESC"]],
      include: [
        { model: Book, attributes: ["Title", "BookID"] },
        { model: Member, attributes: ["MemberName", "MemberID"] },
      ],
    });

    return res.status(200).json({ returnRequests: requests });
  } catch (error) {
    console.error("Error fetching return requests:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await BookRequest.findAll({
      order: [["RequestDate", "DESC"]],
      include: [
        { model: Book, attributes: ["Title", "BookID"] },
        { model: Member, attributes: ["MemberName", "MemberID"] },
      ],
    });

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching all requests:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params; // or req.query if you prefer ?status=pending

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const requests = await BookRequest.findAll({
      where: { Status: status.toLowerCase() },
      order: [["RequestDate", "DESC"]],
      include: [
        { model: Book, attributes: ["Title", "BookID"] },
        { model: Member, attributes: ["MemberName", "MemberID"] },
      ],
    });

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching requests by status:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


