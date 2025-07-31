
import BookModel from '../models/book.model.js';
import CategoryModel from '../models/category.model.js';
import { Op } from 'sequelize';
import sequelize from '../models/index.js';

const Category = CategoryModel(sequelize);
const Book = BookModel(sequelize, Category);

export const getAllBooksService = async () => {
  return await Book.findAll();
};

export const searchBooksService = async (filters) => {
  const { title, author, category } = filters;

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

  return await Book.findAll({ where: whereClause });
};

export const getBooksByCategoryService = async (categoryName) => {
  return await Book.findAll({
    include: {
      model: Category,
      where: {
      CategoryName: {
        [Op.like]: `%${categoryName}%`
      }
    },

      attributes: ['CategoryName'],
    },
  });
};

