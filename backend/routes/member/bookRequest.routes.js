import express from 'express'
import { borrowBookRequest,returnBookRequest } from '../../controllers/member/bookRequest.controller.js'
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router=express.Router();

router.use(authenticateToken)

router.post('/borrow/:bookId',borrowBookRequest)
router.post('/return/:bookId',returnBookRequest)

export default router