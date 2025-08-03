import Navbar from "../components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-danger-subtle text-center p-3">
        <div
          className="bg-white bg-opacity-10 rounded-4 shadow p-5"
          style={{
            maxWidth: "600px",
            cursor: "default",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <i className="bi bi-person-fill fs-1 text-danger mb-3"></i>
          <h1 className="display-5 text-danger mb-3">💖 About Me</h1>
          <p className="lead text-danger">
            Hi! I'm a developer who loves anime, kawaii style, and fun coding projects.
          </p>
        </div>
      </div>
    </>
  );
}
