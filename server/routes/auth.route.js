import express from "express"
import { Login, Logout, Refresh, Signup } from "../controllers/auth.controller.js"
const router = express.Router()

router.post('/login', Login)
router.post('/signup', Signup)
router.post('/refresh', Refresh)
router.post('/logout', Logout)

export default router