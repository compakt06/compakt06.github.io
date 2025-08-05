import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import FlirtiniLogo from "../assets/flirtini.png";

export default function Projects() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#a0c8f0] to-[#f4c1d2] p-6 text-center" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
        <div className="bg-[#fdf9f3] rounded-3xl border-4 border-[#9a7fbf] shadow-[5px_5px_0_#aabbcc] p-8 max-w-xl w-full cursor-default">
          <h1 className="text-5xl font-extrabold text-[#9a7fbf] mb-8 select-none">Projects</h1>
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#9a7fbf] mb-4 select-none">Created by me</h2>
            <Link to="/orders" className="inline-flex items-center gap-3 bg-[#f4c1d2] border-4 border-[#d8b8d8] rounded-xl px-6 py-4 shadow-[3px_3px_0_#a18aba] text-[#9a7fbf] hover:bg-[#9a7fbf] hover:text-[#fdf9f3] transition select-none"><i className="bi bi-basket-fill fs-3"></i><span>🍗 KFC Orders</span></Link>
          </section>
          <section>
            <h2 className="text-3xl font-bold text-[#9a7fbf] mb-4 select-none">Co-builder</h2>
            <a href="https://github.com/yourco-builder" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-[#f4c1d2] border-4 border-[#d8b8d8] rounded-xl px-6 py-4 shadow-[3px_3px_0_#a18aba] text-[#9a7fbf] hover:bg-[#9a7fbf] hover:text-[#fdf9f3] transition select-none"><img src={FlirtiniLogo} alt="Flirtini Logo" className="h-8 w-8 rounded drop-shadow-sm" /><span>Flirtini</span></a>
          </section>
        </div>
      </div>
    </>
  );
}
