import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { useState } from "react"
import { Outlet } from "react-router-dom"


function Dashboard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex w-full h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
      <div className="flex flex-col w-full">
        <Topbar setIsOpen={setIsOpen}/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Dashboard