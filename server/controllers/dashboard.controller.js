import { Order } from "../models/Order.js";
import { User } from "../models/User.js";

const getStats = async (req, res) => {
	try {
		//total revenue, total orders, total users, pending orders.
		const totalRevenueResult = await Order.aggregate([
            {
                $match: {status: "Success"}
            },
			{
				$group: {
					_id: null,
					totalRevenue: { $sum: "$amount" },
				},
			},
		]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

		const totalOrders = await Order.countDocuments();
		const totalPendingOrders = await Order.countDocuments({
			status: "Pending",
		});
		const totalUsers = await User.countDocuments();

		res.status(200).json({
            success: true,
            totalOrders,
            totalRevenue,
            totalPendingOrders,
            totalUsers
        });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const getTransactions = async(req, res) => {
	try {

        const tenRecentOrders = await Order.find().sort({createdAt: -1}).limit(10).select("customerName customerEmail amount status createdAt")
        
        res.status(200).json({
            success: true,
            tenRecentOrders
        })

	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const getCharts = async(req, res) => {
	try {

        const barOrLineChartData = await Order.aggregate([
            {
                $group: {
                _id: {$month: "$createdAt"},
                revenueInMonth: {$sum: "$amount"},
                ordersCount: {$sum: 1}
                }
            },
            {
                $sort: {_id: 1}
            },
            {
                $project: {
                    _id: 0,
                    revenueInMonth: 1,
                    ordersCount: 1,
                    month: {
                        $switch: {
                            branches: [
                                {case: {$eq: ["$_id", 1]}, then: "January"},
                                {case: {$eq: ["$_id", 2]}, then: "February"},
                                {case: {$eq: ["$_id", 3]}, then: "March"},
                                {case: {$eq: ["$_id", 4]}, then: "April"},
                                {case: {$eq: ["$_id", 5]}, then: "May"},
                                {case: {$eq: ["$_id", 6]}, then: "June"},
                                {case: {$eq: ["$_id", 7]}, then: "July"},
                                {case: {$eq: ["$_id", 8]}, then: "August"},
                                {case: {$eq: ["$_id", 9]}, then: "September"},
                                {case: {$eq: ["$_id", 10]}, then: "October"},
                                {case: {$eq: ["$_id", 11]}, then: "November"},
                                {case: {$eq: ["$_id", 12]}, then: "December"}
                            ],
                            default: "Unknown"
                        }
                    }
                }
            }
        ])
        console.log("barOrLineChartData-->>", barOrLineChartData);
        
        const pieChartData = await Order.aggregate([
            {
                $group: {
                _id: "$category",
                count: {$sum: 1}
                }
            },
            {
                $sort:{count: -1}
            },
            {
                $project:{
                    category: "$_id",
                    _id: 0,
                    count: 1
                }
            }
        ])

        res.status(200).json({
            success: true,
            barOrLineChartData,
            pieChartData
        })

	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

export {getCharts, getTransactions, getStats}