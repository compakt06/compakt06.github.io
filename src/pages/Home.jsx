import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const texts = ["✨ Witam w moim portfolio ✨", "✨ Welcome to my portfolio ✨", "✨ 私のポートフォリオへようこそ ✨", "✨ Bienvenido a mi portafolio ✨"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => { setFade(false); setTimeout(() => { setCurrentTextIndex((p) => (p + 1) % texts.length); setFade(true); }, 500); }, 3500);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#a0c8f0] to-[#f4c1d2] text-center p-6" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
      <h1 className={`text-5xl font-extrabold text-[#9a7fbf] mb-10 min-h-[3.5rem] transition-opacity duration-500 select-none ${fade ? "opacity-100" : "opacity-0"}`}>{texts[currentTextIndex]}</h1>
      <p className="text-2xl text-[#9a7fbf] mb-12 select-none">Explore my world of anime vibes & cute coding 🎀</p>
      <div className="flex flex-wrap justify-center gap-6 max-w-5xl w-full">
        {[{ title: "💖 About Me", description: "Learn more about me!", to: "/about" }, { title: "🍰 Projects", description: "See what I’ve built!", to: "/projects" }, { title: "📩 Contact", description: "Find me on socials!", to: "/contact" }].map(({ title, description, to }) => (
          <div key={title} className="bg-[#f4c1d2] border-4 border-[#d8b8d8] rounded-xl shadow-[5px_5px_0_#a18aba] p-6 flex flex-col max-w-xs flex-1">
            <h2 className="text-[#9a7fbf] text-3xl font-bold mb-3 select-none">{title}</h2>
            <p className="flex-grow mb-6 select-none">{description}</p>
            <Link to={to} className="self-center px-6 py-2 rounded-full border-4 border-[#9a7fbf] text-[#9a7fbf] font-bold hover:bg-[#9a7fbf] hover:text-[#fdf9f3] transition select-none">{title.includes("About") ? "Read More" : title.includes("Projects") ? "See Projects" : "Contact Me"}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
