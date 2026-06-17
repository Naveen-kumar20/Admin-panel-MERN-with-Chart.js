import express from 'express'
import { getCharts, getStats, getTransactions } from '../controllers/dashboard.controller.js'
import { verifyAccessToken } from '../middlewares/verifyToken.js'

const router = express.Router();

router.get('/get-stats', verifyAccessToken, getStats);
router.get('/get-transactions', verifyAccessToken, getTransactions);
router.get('/get-charts', verifyAccessToken, getCharts);

export default router;