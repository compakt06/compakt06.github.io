import Navbar from "../components/Navbar";
import windowsBg from "../assets/windowsbg.jpg";

export default function Contact() {
  const contacts = [
    { img: "https://cdn.simpleicons.org/maildotru/0058e3", alt: "Email", content: "email", isLink: false },
    { img: "https://cdn.simpleicons.org/orange/0058e3", alt: "Phone PL", content: "Nuh uh", isLink: false },
    { img: "https://cdn.simpleicons.org/orange/0058e3", alt: "Phone ES", content: "Nuh uh", isLink: false },
    { img: "https://cdn.simpleicons.org/github/0058e3", alt: "GitHub", content: "GitHub", isLink: true, href: "https://github.com/compakt06" },
    { img: "https://cdn.simpleicons.org/instagram/0058e3", alt: "Instagram", content: "Instagram", isLink: true, href: "https://www.instagram.com/podroze_blahaja/" }
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 select-none font-tahoma" style={{ backgroundImage: `url(${windowsBg})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center bottom", backgroundAttachment: "fixed" }}>
        <div className="w-[90vw] max-w-[960px] rounded-t-lg overflow-hidden border-[3px] border-[#0058e3] shadow-[0_0_12px_rgba(0,0,0,0.3)] bg-[#ece9d8] flex flex-col">
          <div className="h-8 flex items-center justify-between px-3 text-white font-bold text-[13px] bg-gradient-to-b from-[#0058e3] to-[#0a83f8] select-none">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4H2v16h20V6H12l-2-2z" />
              </svg>
              <span>Contact Me</span>
            </div>
            <div className="flex gap-1">
              <button aria-label="Minimize" className="w-5 h-5 bg-[#ece9d8] border border-[#7a9ec8] rounded-sm cursor-pointer p-0 font-bold text-[12px] text-[#0058e3] leading-none select-none hover:bg-[#0a83f8] hover:text-white transition-colors">_</button>
              <button aria-label="Maximize" className="w-5 h-5 bg-[#ece9d8] border border-[#7a9ec8] rounded-sm cursor-pointer p-0 font-bold text-[12px] text-[#0058e3] leading-none select-none hover:bg-[#0a83f8] hover:text-white transition-colors">□</button>
              <button aria-label="Close" className="w-5 h-5 bg-[#ece9d8] border border-[#7a9ec8] rounded-sm cursor-pointer p-0 font-bold text-[12px] text-[#0058e3] leading-none select-none hover:bg-red-600 hover:text-white transition-colors">×</button>
            </div>
          </div>
          <div className="bg-[#ece9d8] p-6 min-h-[60vh] overflow-y-auto text-[#0058e3] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-[1px_1px_3px_rgba(0,0,0,0.2)] border border-[#b5b5b5]">
                ✉️
              </div>
              <h1 className="font-bold text-3xl">Contact Me</h1>
            </div>
            <div className="bg-white p-4 rounded-md border border-[#b5b5b5] shadow-[1px_1px_3px_rgba(0,0,0,0.1)] mb-8">
              <p className="text-[#0058e3]">Feel free to reach out through any of these methods.</p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#0058e3] rounded-full flex items-center justify-center text-white">📞 </div>
              <h2 className="font-bold text-2xl">Contact Methods</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {contacts.map(({ img, alt, content, isLink, href }) => (
                <div key={content} className="bg-white p-3 rounded-md border border-[#b5b5b5] shadow-[1px_1px_3px_rgba(0,0,0,0.1)] flex flex-col items-center hover:bg-[#e1f0ff] transition-colors cursor-default" onClick={() => isLink && window.open(href, "_blank")}>
                  <img src={img} alt={alt} className="w-10 h-10 mb-2" />
                  {isLink ? (
                    <a href={href} target="_blank" rel="noreferrer" className="font-medium text-[#0058e3] hover:underline">
                      {content}
                    </a>
                  ) : (
                    <span className="font-medium text-[#0058e3]">{content}</span>
                  )}
                </div>
              ))}
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