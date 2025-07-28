import BookModel from '../../models/book.model.js';
import { Op } from 'sequelize';
import sequelize from '../../models/index.js';

const Book = BookModel(sequelize);



export const addBook = async (req, res) => {
  try {
    const { Title, Author, TotalCopies, AvailableCopies, CategoryID } = req.body;

    const category = await Category.findByPk(CategoryID);
    if (!category) {
      return res.status(400).json({ message: 'Invalid CategoryID: category does not exist' });
    }

    const newBook = await Book.create({
      Title,
      Author,
      TotalCopies,
      AvailableCopies,
      CategoryID,
    });

    res.status(201).json({
      message: 'Book added successfully',
      book: newBook,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book', error: err });
  }
};


export const updateBook = async (req, res) => {
  try {
    const { BookID } = req.params;
    const { Title, Author, TotalCopies, AvailableCopies, CategoryID } = req.body;

    const book = await Book.findByPk(BookID);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.update({
      Title,
      Author,
      TotalCopies,
      AvailableCopies,
      CategoryID,
    });

    res.status(200).json({
      message: 'Book updated successfully',
      book,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update book', error: err });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { BookID } = req.params;

    const book = await Book.findByPk(BookID);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.destroy();

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book', error: err });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll(); 

    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
};







export const searchBooks = async (req, res) => {
  try {
    const { title, author, category } = req.query;

    const whereClause = {};

    if (title) {
      whereClause.Title = { [Op.like]: `%${title}%` };
    }

    if (author) {
      whereClause.Author = { [Op.like]: `%${author}%` };
    }

    if (category) {
      whereClause.CategoryID = category;
    }

    const books = await Book.findAll({ where: whereClause });

    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err });
  }
};
