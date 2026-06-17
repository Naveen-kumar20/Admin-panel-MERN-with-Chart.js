import mongoose from "mongoose";
import dns from 'dns'

dns.setServers(["8.8.8.8"])
export const connectDB = async()=>{
    try {
        mongoose.connection.on('connected', ()=>{
            console.log("Database Connected ✅");
        })
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log(error);
    }
}