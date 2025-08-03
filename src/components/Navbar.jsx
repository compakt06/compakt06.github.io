import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom border-3 border-danger-subtle shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-danger" to="/">
          🌸 Shynesss' portfolio
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-danger fw-bold" to="/about">
                💖 About Me
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-danger fw-bold" to="/projects">
                🍰 Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-danger fw-bold" to="/contact">
                📩 Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
