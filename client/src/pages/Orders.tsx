import { CircleArrowLeft, CircleArrowRight, Search} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../api/axiosInstance";

interface OrderData {
	_id: string;
	customerName: string;
	customerEmail: string;
	amount: number;
	status: "Success" | "Pending" | "Failed";
	category: string;
	createdAt: string;
}
interface OrderApiData {
	success: boolean;
	orders: OrderData[];
	totalPages: number;
	totalOrders: number;
	currentPage: number;
}

const statusStyleCSS = {
	Success: "bg-green-100 text-green-700",
	Pending: "bg-yellow-100 text-yellow-700",
	Failed: "bg-red-100 text-red-700",
};

const tableRowsPerPage = 10;

function Orders() {
	const [statusFilter, setStatusFilter] = useState("All");
	const [searchInput, setSearchInput] = useState("");
	const [page, setPage] = useState(1);
	const [orderApiData, setOrderApiData] = useState<OrderApiData | null>(null);

	async function fetchTableData() {
		try {
			const params = {
				...(searchInput && { search: searchInput }),
				...(statusFilter !== "All" && { status: statusFilter }),
				limit: tableRowsPerPage,
				page,
			};
			const res = await axiosInstance.get("/orders", { params });
			setOrderApiData(res.data);
			console.log(res.data);
		} catch (error: any) {
			toast.error(
				error.response?.data?.message || "Failed to fetch data",
			);
		}
	}

	// Debouncing for search box input.
	useEffect(() => {
		const timerId = setTimeout(() => {
			fetchTableData();
			setPage(1);
		}, 500);

		return () => clearTimeout(timerId);
	}, [searchInput]);

	useEffect(() => {
		fetchTableData();
	}, [statusFilter, page]);

	return (
		<main className="w-full p-4 flex flex-col gap-2 overflow-y-auto">
			<div className="w-full">
				<h2 className="text-4xl font-semibold">All orders</h2>
				<p className="text-base text-gray-500">
					Track your customer transactions
				</p>
			</div>

			<section className="flex flex-col gap-5 items-center">
				<div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center w-full border border-gray-400 rounded-lg p-4">
					{/* searchBox */}
					<div className="flex gap-1 border p-2 border-gray-400 lg:min-w-120 rounded-lg">
						<input
							type="text"
							placeholder="Search name"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="flex-1 outline-none"
						/>
						<Search className="text-gray-400" />
					</div>

					{/* Drop down */}
					<div className="flex items-center gap-2">
						<span className="text-xl">Status: </span>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="border border-gray-400 p-2 rounded-lg outline-0"
						>
							<option value="All">All</option>
							<option value="Success">Success</option>
							<option value="Pending">Pending</option>
							<option value="Failed">Failed</option>
						</select>
					</div>
				</div>

				{/* Table */}
				<div className="w-full flex flex-col overflow-x-auto">
					<table className="w-full min-w-150 min-h-100 text-center">
						<thead>
							<tr>
								<th>S.no</th>
								<th>Name</th>
								<th>Email</th>
								<th>Amount(Rs)</th>
								<th>Status</th>
								<th>Category</th>
								<th>Order data</th>
							</tr>
						</thead>
						<tbody>
							{orderApiData?.orders.length === 0 ? (
								<tr>
									<td colSpan={7}>No data found.</td>
								</tr>
							) : (
								orderApiData?.orders.map((order, index) => (
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
										<td>{order.category}</td>
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
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="flex gap-2 items-center">
						<button
							onClick={() => {
								if (page > 1) setPage((prev) => prev - 1);
							}}
							className="cursor-pointer"
						>
							<CircleArrowLeft />
						</button>
						<p>
							{orderApiData?.currentPage || 1} of{" "}
							{orderApiData?.totalPages || 1} pages
						</p>{" "}
						{/*make dynamic later*/}
						<button
							onClick={() => {
								if (orderApiData && page < orderApiData.totalPages)
									setPage((prev) => prev + 1);
							}}
							className="cursor-pointer"
						>
							<CircleArrowRight />
						</button>
					</div>
			</section>
		</main>
	);
}

export default Orders;
