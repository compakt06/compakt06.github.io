import Navbar from "../components/Navbar";

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#a0c8f0] to-[#c4b7d6] p-6">
        <div className="bg-[#fdf9f3] border-4 border-[#6a5d9c] shadow-none p-10 max-w-4xl w-full text-center font-mono" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
          <h1 className="text-5xl font-extrabold text-[#6a5d9c] mb-10 select-none border-b-2 border-[#6a5d9c] pb-2">📩 Contact Me</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-[#6a5d9c] text-xl font-semibold">
            {[
              { img: "https://cdn.simpleicons.org/maildotru/6a5d9c", alt: "Email", content: "jakub.zielinskisp55@gmail.com", isLink: false },
              { img: "https://cdn.simpleicons.org/orange/6a5d9c", alt: "Phone PL", content: "+48 500 774 136", isLink: false },
              { img: "https://cdn.simpleicons.org/orange/6a5d9c", alt: "Phone ES", content: "+34 692 563171", isLink: false },
              { img: "https://cdn.simpleicons.org/github/6a5d9c", alt: "GitHub", content: "GitHub", isLink: true, href: "https://github.com/compakt06" },
              { img: "https://cdn.simpleicons.org/instagram/6a5d9c", alt: "Instagram", content: "Instagram", isLink: true, href: "https://www.instagram.com/podroze_blahaja/" }
            ].map(({ img, alt, content, isLink, href }) => (
              <div key={content} className="bg-[#dcd6f7] border-2 border-[#6a5d9c] p-6 flex flex-col items-center cursor-default">
                {isLink ? (
                  <a href={href} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 text-[#6a5d9c] hover:text-[#483d8b] no-underline transition">
                    <img src={img} alt={alt} className="w-8 h-8 mb-2" />
                    <span>{content}</span>
                  </a>
                ) : (
                  <>
                    <img src={img} alt={alt} className="w-8 h-8 mb-2" />
                    <span>{content}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
