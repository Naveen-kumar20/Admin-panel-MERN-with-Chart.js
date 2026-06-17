import { type LucideIcon } from "lucide-react";
interface StatCardProp {
	label: string;
	value: number;
	icon: LucideIcon;
	primaryColor: string;
	backgroundColor: string;
}
function StatCard({
	label,
	value,
	icon: Icon,
	primaryColor,
	backgroundColor,
}: StatCardProp) {
	return (
		<div className="flex flex-col gap-2 shadow-md border border-gray-200  p-3 rounded-sm">
			<div>
				<span
					style={{ backgroundColor }}
					className="inline-block p-2 rounded-sm"
				>
					<Icon style={{ color: primaryColor }} />
				</span>
			</div>
			<div>
				<p className="text-gray-500 text-xs mb-1">{label}</p>
				<h3 className="text-2xl">
					{label === "Total Revenue" ? `₹${value.toLocaleString()}` : value}
				</h3>
			</div>
		</div>
	);
}

export default StatCard;
