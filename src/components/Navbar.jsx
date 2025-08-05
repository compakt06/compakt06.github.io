import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[#f4c1d2] via-[#f9e7f5] to-[#f4c1d2] border-b-4 border-[#9a7fbf] fixed w-full z-50" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 select-none">
          <div className="flex-shrink-0"><Link to="/" className="text-3xl font-extrabold text-[#9a7fbf]">🌸 Shynesss' portfolio</Link></div>
          <div className="flex lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-[#9a7fbf] hover:text-[#fdf9f3] hover:bg-[#9a7fbf] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#9a7fbf]" aria-controls="mobile-menu" aria-expanded={isOpen}><span className="sr-only">Open main menu</span>{!isOpen ? <svg className="block h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg> : <svg className="block h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>}</button>
          </div>
          <div className="hidden lg:flex lg:space-x-8">
            {[{ to: "/about", label: "💖 About Me" }, { to: "/projects", label: "🍰 Projects" }, { to: "/contact", label: "📩 Contact" }].map(({ to, label }) => (
              <Link key={to} to={to} className="text-[#9a7fbf] font-semibold hover:text-[#e68ca7] px-3 py-2 rounded-md">{label}</Link>
            ))}
          </div>
        </div>
      </div>

      {isOpen && <div className="lg:hidden" id="mobile-menu"><div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-br from-[#a0c8f0] to-[#f4c1d2] border-t border-[#9a7fbf]">{[{ to: "/about", label: "💖 About Me" }, { to: "/projects", label: "🍰 Projects" }, { to: "/contact", label: "📩 Contact" }].map(({ to, label }) => (<Link key={to} to={to} onClick={() => setIsOpen(false)} className="block text-[#9a7fbf] font-semibold hover:text-[#e68ca7] px-3 py-2 rounded-md">{label}</Link>))}</div></div>}
    </nav>
  );
}
