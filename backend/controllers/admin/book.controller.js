import BookModel from '../../models/book.model.js';
import CategoryModel from '../../models/category.model.js'
import { Op } from 'sequelize';
import sequelize from '../../models/index.js';
import { getAllBooksService,searchBooksService } from '../../services/book.service.js';

const Category=CategoryModel(sequelize)
const Book = BookModel(sequelize,Category);

export const addBook = async (req, res) => {
  try {
    const { Title, Author, TotalCopies, AvailableCopies, CategoryID, Image } = req.body;

    const existingBook = await Book.findOne({
      where: {
        Title,
        Author,
      },
    });

    if (existingBook) {
      return res.status(400).json({ message: 'Book with this title and author already exists' });
    }

    const newBook = await Book.create({
      Title,
      Author,
      TotalCopies,
      AvailableCopies,
      CategoryID,
      Image: Image || null,
    });

    res.status(201).json({
      message: 'Book added successfully',
      book: newBook,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book', error: err.message });
  }
};



export const updateBook = async (req, res) => {
  try {
    const { BookID } = req.params;
    const { Title, Author, TotalCopies, AvailableCopies, CategoryID, Image } = req.body;

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
      Image: Image || book.Image, // keep existing if none provided
    });

    res.status(200).json({
      message: 'Book updated successfully',
      book,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update book', error: err.message });
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
    const books = await getAllBooksService();
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const filters = {
      title: req.query.title,
      author: req.query.author,
      category: req.query.category,
    };

    const books = await searchBooksService(filters);
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};
