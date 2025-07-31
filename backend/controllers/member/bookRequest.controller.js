
import BookModel from '../../models/book.model.js';
import MemberModel from '../../models/member.model.js';
import BookRequestModel from '../../models/bookRequest.model.js';
import CategoryModel from '../../models/category.model.js';
import sequelize from '../../models/index.js';
import dayjs from 'dayjs';
import TransactionModel from '../../models/transaction.model.js';

const Category = CategoryModel(sequelize);
const Book = BookModel(sequelize, Category);
const Member = MemberModel(sequelize);
const BookRequest = BookRequestModel(sequelize, Book, Member);
const Transaction=TransactionModel(sequelize,Book,Member)

export const borrowBookRequest = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { memberId, daysToBorrow } = req.body;

     if (!memberId) {
      return res.status(400).json({ message: "Member ID is required." });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.AvailableCopies <= 0) {
      return res.status(400).json({ message: 'No available copies to borrow' });
    }

    const borrowRequest = await BookRequest.create({
      MemberID: memberId,
      BookID: bookId,
      RequestType: 'borrow',
      DaysToBorrow: daysToBorrow || 7,
      Status: 'pending',
      AdminResponseDate: null,
    });

    res.status(201).json({
      message: 'Borrow request submitted successfully',
      request: borrowRequest,
    });
    } catch (err) {
        res.status(500).json({ message: 'Failed to submit borrow request', error: err.message });
    }
};


export const returnBookRequest = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { memberId } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingTransaction = await Transaction.findOne({
      where: {
        BookID: bookId,
        MemberID: memberId,
        ReturnDate: null,
      },
    });

    if (!existingTransaction) {
      return res.status(400).json({ message: 'This book is not currently borrowed by the member.' });
    }

    const returnRequest = await BookRequest.create({
      MemberID: memberId,
      BookID: bookId,
      RequestType: 'return',
      Status: 'pending',
      AdminResponseDate: null,
      DaysToBorrow: null,
    });

    res.status(201).json({
      message: 'Return request submitted successfully',
      request: returnRequest,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit return request', error: err.message });
  }
};

