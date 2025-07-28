import express from 'express';
import {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  searchBooks
} from '../../controllers/admin/book.controller.js';

const router = express.Router();

router.post('/add', addBook);             
router.put('/:BookID', updateBook);    
router.delete('/:BookID', deleteBook);
router.get('/',getAllBooks);
router.get('/search', searchBooks);

export default router;
