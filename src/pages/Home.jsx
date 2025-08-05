import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import windowsBg from "../assets/windowsbg.jpg";

export default function Home() {
  const texts = [
    "✨ Witam w moim portfolio ✨",
    "✨ Welcome to my portfolio ✨",
    "✨ 私のポートフォリオへようこそ ✨",
    "✨ Bienvenido a mi portafolio ✨",
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentTextIndex((p) => (p + 1) % texts.length);
        setFade(true);
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, [texts.length]);

  const desktopIcons = [
    { title: "About Me", to: "/about", icon: "📁" },
    { title: "Projects", to: "/projects", icon: "📂" },
    { title: "Contact", to: "/contact", icon: "📧" },
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 select-none font-tahoma" 
        style={{ backgroundImage: `url(${windowsBg})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center bottom",backgroundAttachment: "fixed",}}
      >
        <div className="w-[90vw] max-w-[960px] rounded-t-lg overflow-hidden border-[3px] border-[#0058e3] shadow-[0_0_12px_rgba(0,0,0,0.3)] bg-[#ece9d8] flex flex-col">
          <div className="h-8 flex items-center justify-between px-3 text-white font-bold text-[13px] bg-gradient-to-b from-[#0058e3] to-[#0a83f8] select-none">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4H2v16h20V6H12l-2-2z" />
              </svg>
              <span>Home</span>
            </div>
            <div className="flex gap-1">
              <button aria-label="Minimize" className="w-5 h-5 bg-[#ece9d8] border border-[#7a9ec8] rounded-sm cursor-pointer p-0 font-bold text-[12px] text-[#0058e3] leading-none select-none hover:bg-[#0a83f8] hover:text-white transition-colors">_</button>
              <button aria-label="Maximize" className="w-5 h-5 bg-[#ece9d8] border border-[#7a9ec8] rounded-sm cursor-pointer p-0 font-bold text-[12px] text-[#0058e3] leading-none select-none hover:bg-[#0a83f8] hover:text-white transition-colors">□</button>
              <button aria-label="Close" className="w-5 h-5 bg-[#ece9d8] border border-[#7a9ec8] rounded-sm cursor-pointer p-0 font-bold text-[12px] text-[#0058e3] leading-none select-none hover:bg-red-600 hover:text-white transition-colors">×</button>
            </div>
          </div>
          
          <div className="bg-[#ece9d8] p-6 min-h-[60vh] overflow-y-auto text-[#000080] flex flex-col items-center gap-8">
            <h1 className={`font-bold text-3xl text-center text-[#0058e3] transition-opacity duration-500 min-h-[3rem]`} style={{opacity: fade ? 1 : 0}}>{texts[currentTextIndex]}</h1>         
            <div className="grid grid-cols-3 gap-8 w-full max-w-xl">
              {desktopIcons.map(({ title, to, icon }) => (
                <Link key={title} to={to} className="flex flex-col items-center text-[#0058e3] no-underline cursor-pointer select-none group">
                  <div className="w-20 h-20 bg-white rounded-md flex justify-center items-center text-4xl mb-2 shadow-[2px_2px_4px_rgba(0,0,0,0.2)] border border-[#b5b5b5] group-hover:bg-[#e1f0ff] transition-colors">
                    {icon}
                  </div>
                  <span className="font-medium text-sm text-center px-2 py-1 rounded group-hover:bg-[#0058e3] group-hover:text-white transition-colors">
                    {title}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <Link to="/about" className="px-6 py-2 bg-gradient-to-b from-[#f6f6f6] to-[#d6d6d6] border border-[#b5b5b5] rounded-md text-[#0058e3] font-bold shadow-[1px_1px_2px_rgba(0,0,0,0.2)] hover:from-[#e5f3ff] hover:to-[#c2e2ff] transition-colors">Get Started</Link>
            </div>
          </div>
          
          <div className="h-6 bg-gradient-to-b from-[#e0e0e0] to-[#b5b5b5] border-t border-[#ffffff] flex items-center px-3 text-xs text-[#0058e3] font-medium">
            <span>Ready</span>
          </div>
        </div>
      </div>
    </>
  );
}