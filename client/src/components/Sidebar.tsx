import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import type { RootState } from "../app/store";
import { X } from "lucide-react";
import { LogOut } from "lucide-react";
import { axiosInstance } from "../api/axiosInstance";
import toast from "react-hot-toast";
import { clearCredentials } from "../features/authSlice";

const NavlinKClasses = ({ isActive }: { isActive: boolean }) => {
	return `py-2 cursor-pointer lg:pl-5 ${isActive && "border-l-4 border-l-[#0D9488] bg-[#B3FFF3] text-[#0D9488] font-semibold"}`;
};

interface SideBarProp {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ isOpen, setIsOpen }: SideBarProp) {
	const { user } = useSelector((state: RootState) => state.auth);

	const dispatch = useDispatch()

	const handleLogout = async () => {
		try {
			const res = await axiosInstance.post("/auth/logout");
			dispatch(clearCredentials())
			toast.success(res.data.message);
		} catch (error:any) {
			if(error.response){
				toast.error(error.response.data.message)
			}
		}
	};

	return (
		<div className={`fixed left-0 right-0 h-full bg-white text-center lg:text-left duration-500 ease-in-out shadow-2xl lg:relative lg:w-1/4 lg:translate-x-0 lg:shadow-none lg:border-r lg:border-r-gray-200
		${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
			{/* wrapper div */}
			<div className="flex flex-col h-full p-3 gap-4 justify-between">
				<div className="flex justify-center">
					<span className="flex-1"></span>
					<div className="flex-1 flex flex-col items-center">
						<h1 className="font-bold text-lg">InsightFlow</h1>
						<p className="text-xs text-gray-500 whitespace-nowrap">
							Enterprise analytics
						</p>
					</div>
					<div className="flex-1 flex justify-end">
					
						<X
							onClick={() => setIsOpen((prev) => !prev)}
							className="hover:cursor-pointer lg:hidden"
						/>
					</div>
				</div>
				{/* Navlinks div */}
				<div className="flex flex-col gap-1 lg:-mt-70">
					<NavLink to="/" className={NavlinKClasses} onClick={() => setIsOpen(false)}>
						Dashboard
					</NavLink>
					<NavLink to="/orders" className={NavlinKClasses} onClick={() => setIsOpen(false)}>
						Orders
					</NavLink>
				</div>

				{/* bottom info div */}
				<div className="flex justify-between items-center mx-2">
					<div className="flex flex-col items-start">
						<h2 className="font-bold text-md capitalize">
							{user?.name}
						</h2>
						<p className="text-xs text-gray-500">{user?.email}</p>
					</div>
					<LogOut className="text-xs hover:cursor-pointer" onClick={handleLogout}/>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
