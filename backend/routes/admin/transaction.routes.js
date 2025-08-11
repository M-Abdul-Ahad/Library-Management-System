import express from 'express';
import { issueBook,rejectIssueRequest,acceptBookReturn,getAllBorrowRequests,getAllReturnRequests,getRequestsByStatus} from '../../controllers/admin/transaction.controller.js';

const router = express.Router();

router.post('/issue', issueBook);
router.post('/reject-issue',rejectIssueRequest)
router.post('/accept-book',acceptBookReturn) 
router.get('/borrow-requests',getAllBorrowRequests)   
router.get('/return-requests',getAllReturnRequests)  
router.get('/status/:status',getRequestsByStatus)   


export default router;
