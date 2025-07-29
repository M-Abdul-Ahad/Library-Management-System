import express from 'express';
import { issueBook } from '../../controllers/admin/transaction.controller.js';

const router = express.Router();

router.post('/issue', issueBook);             


export default router;
