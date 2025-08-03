import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const texts = [
    "✨ Witam w moim portfolio ✨",
    "✨ Welcome to my portfolio ✨",
    "✨ 私のポートフォリオへようこそ ✨",
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // zaczynamy zanikanie
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setFade(true); // pokazujemy nowy tekst
      }, 500); // czas zanikania (0.5s)
    }, 3500); // całkowity czas na tekst + animacje

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-danger-subtle text-center p-3">
      <h1
        className="display-4 fw-bold text-danger mb-4"
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          minHeight: "3.5rem",
        }}
      >
        {texts[currentTextIndex]}
      </h1>
      <p className="lead text-danger mb-5">
        Explore my world of anime vibes & cute coding 🎀
      </p>

      <div className="container">
        <div className="row justify-content-center">
          {/* 💖 About Me */}
          <div className="col-md-3 m-2">
            <div className="card shadow rounded-4 border-danger-subtle">
              <div className="card-body">
                <h2 className="card-title text-danger">💖 About Me</h2>
                <p className="card-text">Learn more about me!</p>
                <Link to="/about" className="btn btn-outline-danger rounded-pill">
                  Read More
                </Link>
              </div>
            </div>
          </div>

          {/* 🍰 Projects */}
          <div className="col-md-3 m-2">
            <div className="card shadow rounded-4 border-danger-subtle">
              <div className="card-body">
                <h2 className="card-title text-danger">🍰 Projects</h2>
                <p className="card-text">See what I’ve built!</p>
                <Link to="/projects" className="btn btn-outline-danger rounded-pill">
                  See Projects
                </Link>
              </div>
            </div>
          </div>

          {/* 📩 Contact */}
          <div className="col-md-3 m-2">
            <div className="card shadow rounded-4 border-danger-subtle">
              <div className="card-body">
                <h2 className="card-title text-danger">📩 Contact</h2>
                <p className="card-text">Find me on socials!</p>
                <Link to="/contact" className="btn btn-outline-danger rounded-pill">
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
