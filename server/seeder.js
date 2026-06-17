//this file is for seeding only, run this file independently
import mongoose from "mongoose";
import "dotenv/config";
import { User } from "./models/User.js";
import { Order } from "./models/Order.js";
import dns from 'dns'


dns.setServers(["8.8.8.8"])

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Database connected for seeding ✅');
}
await connectDB();

//deleting presaved data from DB
await Order.deleteMany({})

//===creating dummy data in array start==
const names = [
    { name: "Jordan Smith", email: "j.smith@gmail.com" },
    { name: "Avery Miller", email: "a.miller@gmail.com" },
    { name: "Kelly Brooks", email: "k.brooks@gmail.com" },
    { name: "David Wright", email: "d.wright@gmail.com" },
    { name: "Sarah Connor", email: "s.connor@gmail.com" },
    { name: "James Carter", email: "j.carter@gmail.com" },
    { name: "Emily Davis", email: "e.davis@gmail.com" },
    { name: "Michael Scott", email: "m.scott@gmail.com" },
    { name: "Priya Sharma", email: "p.sharma@gmail.com" },
    { name: "Chris Evans", email: "c.evans@gmail.com" },
]

const statuses = ['Success', 'Pending', 'Failed']
const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Other']

const orders = Array.from({ length: 50 }, () => {
    const customer = names[Math.floor(Math.random() * names.length)]

    // random date within last 12 months
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 365))

    return {
        customerName: customer.name,
        customerEmail: customer.email,
        amount: Math.floor(Math.random() * (5000 - 100 + 1)) + 100,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        createdAt: date
    }
})

//===creating dummy data in array ends==

await Order.insertMany(orders)
console.log('50 orders seeded successfully ✅')
process.exit(0)


// EXAMPLE of data in database:
// {
//   "_id": {
//     "$oid": "6a187c58b4b478e86d890ea5"
//   },
//   "customerName": "Emily Davis",
//   "customerEmail": "e.davis@gmail.com",
//   "amount": 3263,
//   "status": "Failed",
//   "category": "Books",
//   "createdAt": {
//     "$date": "2026-01-31T17:33:12.571Z"
//   },
//   "__v": 0,
//   "updatedAt": {
//     "$date": "2026-05-28T17:33:12.645Z"
//   }
// }