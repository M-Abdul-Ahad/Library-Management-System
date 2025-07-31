import { getAllBooksService, searchBooksService, getBooksByCategoryService } from '../../services/book.service.js';
import BookModel from '../../models/book.model.js';
import CategoryModel from '../../models/category.model.js';
import sequelize from '../../models/index.js';

const Category = CategoryModel(sequelize);
const Book = BookModel(sequelize, Category);


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

export const getBooksByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const books = await getBooksByCategoryService(categoryName);

    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found in this category' });
    }

    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books by category', error: err.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id, {
      include: {
        model: Category,
        attributes: ['CategoryName'],
      },
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ book });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book details', error: err.message });
  }
};