import express from 'express';
import {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  searchBooks
} from '../../controllers/admin/book.controller.js';

import { authenticateToken,authorizeAdmin } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken,authorizeAdmin)

router.post('/add', addBook);             
router.put('/:BookID', updateBook);    
router.delete('/:BookID', deleteBook);
router.get('/',getAllBooks);
router.get('/search', searchBooks);

export default router;
