import { Op } from "sequelize";
import sequelize from "../../models/index.js";
import dayjs from "dayjs";

import BookModel from "../../models/book.model.js";
import BookRequestModel from "../../models/bookRequest.model.js";
import TransactionModel from "../../models/transaction.model.js";
import MemberModel from "../../models/member.model.js";
import CategoryModel from "../../models/category.model.js";

// Initialize models
const Category = CategoryModel(sequelize);
const Book = BookModel(sequelize, Category);
const Member = MemberModel(sequelize);
const Transaction = TransactionModel(sequelize, Book, Member);
const BookRequest = BookRequestModel(sequelize, Book, Member);

// ================= Dashboard Controllers =================

// 1. Basic Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const availableBooks = await Book.sum("AvailableCopies");
    const issuedBooks = totalBooks - availableBooks;
    const totalMembers = await Member.count();

    return res.status(200).json({
      totalBooks,
      availableBooks,
      issuedBooks,
      totalMembers,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// 2. Quick Overview
export const getQuickOverview = async (req, res) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");

    const overdueBooks = await Transaction.count({
      where: {
        DueDate: { [Op.lt]: today },
        ReturnDate: null,
      },
    });

    const dueToday = await Transaction.count({
      where: {
        DueDate: today,
        ReturnDate: null,
      },
    });

    const thirtyDaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");

    // Use JoinDate instead of CreatedAt for members
    const newMembers = await Member.count({
      where: {
        JoinDate: { [Op.gte]: thirtyDaysAgo },
      },
    });

    const activeMembers = await Member.count({
  where: { IsActive: true }
});



    const totalBooks = await Book.count();
    const issuedBooks = await Transaction.count({
      where: { ReturnDate: null },
    });
    const libraryUsage =
      totalBooks > 0 ? Math.round((issuedBooks / totalBooks) * 100) : 0;

    return res.status(200).json({
      overdueBooks,
      dueToday,
      newMembers,
      activeMembers,
      libraryUsage,
    });
  } catch (error) {
    console.error("Error fetching quick overview:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// 3. Recent Activities
export const getRecentActivities = async (req, res) => {
  try {
    const activities = [];

    // Recent transactions
    const recentTransactions = await Transaction.findAll({
      limit: 5,
      order: [["IssueDate", "DESC"]],
      include: [
        { model: Book, attributes: ["Title", "BookID"] },
        { model: Member, attributes: ["MemberName", "MemberID"] },
      ],
    });

    recentTransactions.forEach((trx) => {
      if (trx.ReturnDate) {
        activities.push({
          type: "return",
          text: `Book "${trx.Book.Title}" returned by ${trx.Member.MemberName}`,
          date: trx.ReturnDate,
        });
      } else {
        activities.push({
          type: "issue",
          text: `Book "${trx.Book.Title}" issued to ${trx.Member.MemberName}`,
          date: trx.IssueDate,
        });
      }
    });

    // Recent members (use JoinDate)
    const recentMembers = await Member.findAll({
      limit: 5,
      order: [["JoinDate", "DESC"]],
    });

    recentMembers.forEach((mem) => {
      activities.push({
        type: "member",
        text: `New member "${mem.MemberName}" registered`,
        date: mem.JoinDate,
      });
    });

    // Recent books — since no CreatedAt, we skip or need a manual date column if available
    // If you don't have a date field for books, you can't order by added date.
    // Assuming no date, this will simply show last added based on BookID
    const recentBooks = await Book.findAll({
      limit: 5,
      order: [["BookID", "DESC"]],
      include: [{ model: Category, attributes: ["CategoryName"] }],
    });

    recentBooks.forEach((book) => {
      activities.push({
        type: "book",
        text: `New book "${book.Title}" added to ${book.Category?.CategoryName || "Uncategorized"} category`,
        date: null, // No date available
      });
    });

    // Sort by date if available
    activities.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return dayjs(b.date).diff(dayjs(a.date));
    });

    return res.status(200).json({ activities: activities.slice(0, 8) });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// 4. Recent Transactions
export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      limit: 10,
      order: [["IssueDate", "DESC"]],
      include: [
        { model: Book, attributes: ["Title", "BookID"] },
        { model: Member, attributes: ["MemberName", "MemberID"] },
      ],
    });

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
