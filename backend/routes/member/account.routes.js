import express from 'express'
import { getBorrowedBooks } from '../../controllers/member/account.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router=express.Router();

router.use(authenticateToken)

router.get('/borrowed-books',getBorrowedBooks)

export default router