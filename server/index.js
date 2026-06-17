import "dotenv/config"
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import ordersRoute from "./routes/order.route.js";

const app = express()
const PORT = process.env.PORT || 8080;

await connectDB()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/orders', ordersRoute)


app.listen(PORT, ()=>{
    console.log(`server running at http://localhost:${PORT}`)
})