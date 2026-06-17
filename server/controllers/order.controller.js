import { Order } from "../models/Order.js";

export const getOrders = async(req, res)=>{
    try {
        let {search, status = "All",limit = 10, page = 1} = req.query;
        let filter = {};
        limit = parseInt(limit);
        page = parseInt(page);

        if(page < 1){
            res.status(400).json({success:false, message: "Page value can't be less than 1"})
        }
        if(status!=="All" && status!=="Success" && status!=="Failed" && status!=="Pending"){
            res.status(400).json({success:false, message: "Invalid status filter"})
        }

        if(status && status!=="All"){
            filter.status = status
        }
        if(search){
            filter.customerName = {$regex: search, $options: "i"}
        }
        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders/limit);
        const orders = await Order.find(filter).sort({createdAt: -1}).skip((page - 1) * limit).limit(limit).select("-__v -updatedAt");

        res.status(200).json({
            success: true,
            orders,
            totalPages,
            totalOrders,
            currentPage: page
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"})
    }
}