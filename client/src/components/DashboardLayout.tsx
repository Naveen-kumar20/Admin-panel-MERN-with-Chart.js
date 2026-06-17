import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { axiosInstance } from "../api/axiosInstance";
import {
	BookA,
	CircleDotDashed,
	HandCoins,
	User,
	type LucideIcon,
} from "lucide-react";
import {
	Chart as ChartJs,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	ArcElement,
	Legend,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import toast from "react-hot-toast";

ChartJs.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	ArcElement,
	Legend,
);

interface StatItem {
	label: string;
	value: number;
	icon: LucideIcon;
	primaryColor: string;
	backgroundColor: string;
}

interface LineChartItem {
	revenueInMonth: number;
	ordersCount: number;
	month: string;
}

interface PieChartItem {
	count: number;
	category: string;
}

interface ChartsData {
	barOrLineChartData: LineChartItem[];
	pieChartData: PieChartItem[];
}

interface OrderItemDetail {
	_id: string;
	customerName: string;
	customerEmail: string;
	amount: number;
	status: "Success" | "Pending" | "Failed";
	createdAt: string;
}

interface TableData {
	tenRecentOrders: OrderItemDetail[];
}

const statusStyleCSS = {
	Success: "bg-green-100 text-green-700",
	Pending: "bg-yellow-100 text-yellow-700",
	Failed: "bg-red-100 text-red-700",
};

function DashboardLayout() {
	const [stats, setStats] = useState<StatItem[]>([]);
	const [chartsData, setChartsData] = useState<ChartsData | null>(null);
	const [tableData, setTableData] = useState<TableData | null>(null);
	//fetching stats card data
	useEffect(() => {
		async function fetchStats() {
			try {
				const res = await axiosInstance.get("/dashboard/get-stats");
				const {
					totalUsers,
					totalPendingOrders,
					totalRevenue,
					totalOrders,
				} = res.data;
				setStats([
					{
						label: "Total Orders",
						value: totalOrders,
						icon: BookA,
						primaryColor: "#005049",
						backgroundColor: "#B3FFF3",
					},
					{
						label: "Total Revenue",
						value: totalRevenue,
						icon: HandCoins,
						primaryColor: "#3323CC",
						backgroundColor: "#E2DFFF",
					},
					{
						label: "Total Users",
						value: totalUsers,
						icon: User,
						primaryColor: "#283044",
						backgroundColor: "#BEC6E0",
					},
					{
						label: "Total Pending Orders",
						value: totalPendingOrders,
						icon: CircleDotDashed,
						primaryColor: "#2196f3",
						backgroundColor: "#ebf6ff",
					},
				]);
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || "Failed to load stats",
				);
			}
		}
		fetchStats();
	}, []);

	//fetching chart data
	useEffect(() => {
		async function fetchChartsData() {
			try {
				const res = await axiosInstance.get("/dashboard/get-charts");
				const { barOrLineChartData, pieChartData } = res.data;
				setChartsData((prev) => ({
					...prev,
					barOrLineChartData,
					pieChartData,
				}));
			} catch (error: any) {
				toast.error(
					error.response?.data?.message ||
						"Failed to get charts data",
				);
			}
		}
		fetchChartsData();
	}, []);

	//fetching table data
	useEffect(() => {
		async function fetchTableData() {
			try {
				const res = await axiosInstance.get(
					"/dashboard/get-transactions",
				);
				const { tenRecentOrders } = res.data;
				setTableData((prev) => ({ ...prev, tenRecentOrders }));
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message ||
						"Failed to fetch table content",
				);
			}
		}
		fetchTableData();
	}, []);

	const lineChartData = {
		labels: chartsData?.barOrLineChartData.map((i) => i.month),
		datasets: [
			{
				data: chartsData?.barOrLineChartData.map(
					(i) => i.revenueInMonth,
				),
				borderColor: "#219ebc",
				backgroundColor: "#023047",
				tension: 0.4,
			},
		],
	};
	const lineChartoptions = {
		plugins: {
			title: {
				display: true,
				text: "Revenue in FY25-26",
			},
			legend: {
				display: false,
			},
		},
	};

	const pieChartData = {
		labels: chartsData?.pieChartData.map((i) => i.category),
		datasets: [
			{
				data: chartsData?.pieChartData.map((i) => i.count),
				backgroundColor: [
					"#219ebc",
					"#0D9488",
					"#023047",
					"#ffb703",
					"#fb8500",
				],
			},
		],
	};

	const pieChartOptions = {
		plugins: {
			title: {
				display: true,
				text: "Orders by category in FY25-26",
			},
		},
	};

	return (
		<main className="w-full p-4 flex flex-col gap-2 overflow-y-auto">
			{/*--- cards div--- */}
			<section className="flex flex-col gap-3">
				<div>
					<h1 className="font-bold text-2xl lg:text-4xl">
						Analytics Dashboard
					</h1>
					<p className="text-xs text-gray-500 lg:text-base">
						Overview of business growth metrics
					</p>
				</div>
				{/* cards */}
				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-2">
					{stats.map((stat) => (
						<StatCard
							key={stat.label}
							label={stat.label}
							value={stat.value}
							icon={stat.icon}
							primaryColor={stat.primaryColor}
							backgroundColor={stat.backgroundColor}
						/>
					))}
				</div>
			</section>

			{/*--- charts div--- */}
			<section className="flex flex-col gap-2 w-full lg:flex-row">
				{/* line chart */}
				<div className="w-full lg:w-2/3 shadow-md border border-gray-200  p-3 rounded-sm">
					<Line data={lineChartData} options={lineChartoptions} />
				</div>

				{/* pie chart */}
				<div className="w-full flex justify-center items-center lg:w-1/3 shadow-md border border-gray-200  p-3 rounded-sm">
					<Doughnut data={pieChartData} options={pieChartOptions} />
				</div>
			</section>

			{/*--- table div--- */}
			<section className="w-full shadow-md border flex flex-col gap-2 border-gray-200 p-3 rounded-sm">
				<div className="w-full">
					<h2 className="text-xl font-semibold">Recent Orders</h2>
					<span className="text-sm text-gray-500">
						Last 10 Orders
					</span>
				</div>
				<div className="w-full overflow-x-auto">
					<table className="w-full min-w-150 text-center">
						<thead>
							<tr>
								<th>S.no</th>
								<th>Name</th>
								<th>Email</th>
								<th>Amount (Rs)</th>
								<th>Status</th>
								<th>Order date</th>
							</tr>
						</thead>
						<tbody>
							{tableData?.tenRecentOrders.map((order, index) => (
								<tr key={order._id}>
									<td>{index + 1}</td>
									<td>{order.customerName}</td>
									<td>{order.customerEmail}</td>
									<td>{order.amount.toLocaleString()}</td>
									<td>
										<span
											className={`${statusStyleCSS[order.status]} py-0.5 text-sm inline-block w-20 px-1 rounded-full`}
										>
											{order.status}
										</span>
									</td>
									<td>
										{new Date(
											order.createdAt,
										).toLocaleDateString("en-IN", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</main>
	);
}

export default DashboardLayout;
