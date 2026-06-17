import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

interface TopBarProp {
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const pageTitles:Record<string, string> = {
  '/': 'Dashboard',
  '/orders': 'Orders'
}
function Topbar({ setIsOpen }: TopBarProp) {

  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] ?? 'InsightFlow'

	return (
		<div className="w-full items-center flex p-2 border-b border-gray-200">
			<span className="flex-1"></span>
			<span className="flex-1 text-center font-semibold">{pageTitle}</span>
			<div className="flex-1 flex justify-end">
        <Menu className="lg:hidden" onClick={() => setIsOpen((prev) => !prev)} />
      </div>
		</div>
	);
}

export default Topbar;
