import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Navbar() {
  const location = useLocation()
  const [time, setTime] = useState("")
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      setTime(`${hours}:${minutes}`)
    }
    updateClock()
    const interval = setInterval(updateClock, 10000)
    return () => clearInterval(interval)
  }, [])
  const links = [{ to: "/", label: "🏠 Home" }, { to: "/about", label: "🧍 About" }, { to: "/projects", label: "💾 Projects" }, { to: "/contact", label: "📬 Contact" }]
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-10 flex items-center px-2 z-[9999] select-none font-[Tahoma] text-sm border-t-[2px] border-t-[#1c3e7d] shadow-[inset_0_1px_0_#4a7edc,inset_0_-1px_0_#1c3e7d,0_2px_5px_rgba(0,0,0,0.3)] bg-[#316ac5]">
      <div className="flex items-center space-x-3 flex-1">
        <button onMouseDown={e => e.currentTarget.style.background = "linear-gradient(to bottom, #6fae1c 0%, #5a9016 100%)"}
          onMouseUp={e => e.currentTarget.style.background = "linear-gradient(to bottom, #9acd32 0%, #6fae1c 100%)"}
          onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(to bottom, #9acd32 0%, #6fae1c 100%)"}
          className="flex items-center justify-center h-7 pl-1 pr-3 space-x-2 text-xs font-bold text-white rounded-sm shadow-[inset_0_1px_0_#cde99b,inset_0_-1px_0_#4f8a10,1px_1px_0_#000] border-[2px] border-[#3e6c0a]"
          style={{ background: "linear-gradient(to bottom, #9acd32 0%, #6fae1c 100%)", textShadow: "1px 1px 2px #3e6c0a" }}>
          <img src="/startLogo.png" alt="XP Logo" className="h-5 w-5 pointer-events-none" draggable={false} />
          <span>Start</span>
        </button>
        <div className="flex space-x-0.5 h-7">
          {links.map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to} className={`flex items-center px-3 ${active ? "bg-[#c3d9ff] text-[#000080] font-bold border-t-2 border-l-2 border-r-2 border-white border-b-0 shadow-[inset_0_1px_0_#7ca7eb,inset_0_-1px_0_#1c3e7d] -mb-[2px]" : "bg-[#3a6ea5] text-white border-b-[2px] border-b-[#1c3e7d]"}`}>
                {label}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="text-white font-bold font-[Tahoma] text-[0.85rem] pr-3 min-w-[50px] text-right pointer-events-none" style={{ textShadow: "1px 1px 1px #1c3e7d" }}>{time}</div>
    </nav>
  )
}
