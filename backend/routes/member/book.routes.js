import express from 'express';
import {
  getBooksByCategory,
  getAllBooks,
  searchBooks
} from '../../controllers/member/book.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken)

router.get('/',getAllBooks);
router.get('/search', searchBooks);
router.get('/category/:categoryName',getBooksByCategory)

export default router;