import express from 'express';
import { getDashboardStats,getQuickOverview,getRecentActivities,getRecentTransactions } from '../../controllers/admin/dashboard.controller.js';

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/quick-overview", getQuickOverview);
router.get("/recent-activities", getRecentActivities);
router.get("/recent-transactions", getRecentTransactions);

export default router;
