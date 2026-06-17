import express from 'express'
import { getOrders } from '../controllers/order.controller.js'
import { verifyAccessToken } from '../middlewares/verifyToken.js'
const router = express.Router()

router.get('/', verifyAccessToken ,getOrders)

export default router