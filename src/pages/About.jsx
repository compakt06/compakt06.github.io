import Navbar from "../components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#a0c8f0] to-[#f4c1d2] p-6 text-center" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
        <div className="bg-[#fdf9f3] rounded-3xl border-4 border-[#9a7fbf] shadow-[5px_5px_0_#aabbcc] p-8 max-w-lg cursor-default">
          <div className="text-8xl mb-4 select-none">💖</div>
          <h1 className="text-5xl font-extrabold text-[#9a7fbf] mb-4 select-none">About Me</h1>
          <p className="text-[#9a7fbf] mb-8 select-none">Hi! I'm a developer who loves anime, kawaii style, and fun coding projects.</p>
          <h2 className="text-3xl font-bold text-[#9a7fbf] mb-4 select-none">Languages I Know</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[{ name: "HTML", logo: "https://cdn.simpleicons.org/html5/9a7fbf" }, { name: "CSS", logo: "https://cdn.simpleicons.org/css/9a7fbf" }, { name: "JS", logo: "https://cdn.simpleicons.org/javascript/9a7fbf" }, { name: "React", logo: "https://cdn.simpleicons.org/react/9a7fbf" }, { name: "Vue", logo: "https://cdn.simpleicons.org/vue/9a7fbf" }, { name: "Laravel", logo: "https://cdn.simpleicons.org/laravel/9a7fbf" }, { name: "SQL", logo: "https://cdn.simpleicons.org/postgresql/9a7fbf" }, { name: "MySQL", logo: "https://cdn.simpleicons.org/mysql/9a7fbf" }].map(({ name, logo }) => (
              <div key={name} className="flex flex-col items-center bg-[#f4c1d2] rounded-xl px-4 py-3 border-4 border-[#d8b8d8] shadow-[3px_3px_0_#a18aba] w-24 select-none"><img src={logo} alt={`${name} logo`} className="h-10 w-10 mb-2 drop-shadow-sm" loading="lazy" /><span className="text-[#9a7fbf] font-semibold">{name}</span></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
