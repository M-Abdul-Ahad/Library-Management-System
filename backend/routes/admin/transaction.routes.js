import express from 'express';
import { issueBook,rejectIssueRequest,acceptBookReturn,getAllBorrowRequests,getAllReturnRequests} from '../../controllers/admin/transaction.controller.js';
import { authenticateToken,authorizeAdmin } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken,authorizeAdmin)

router.post('/issue', issueBook);
router.post('/reject-issue',rejectIssueRequest)
router.post('/accept-book',acceptBookReturn) 
router.get('/borrow-requests',getAllBorrowRequests)   
router.get('/return-requests',getAllReturnRequests)      


export default router;
