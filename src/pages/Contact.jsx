import Navbar from "../components/Navbar";

export default function Contact() {
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
          <i className="bi bi-envelope-fill fs-1 text-danger mb-3"></i>
          <h1 className="display-5 text-danger mb-3">📩 Contact Me</h1>
          <ul className="list-unstyled text-danger mb-0 fs-5">
            <li><i className="bi bi-envelope me-2"></i>jakub.zielinskisp55@gmail.com</li>
            <li><i className="bi bi-telephone me-2"></i>+48 500 774 136</li>
            <li><i className="bi bi-telephone me-2"></i>+34 692 563171</li>
            <li>
              <i className="bi bi-github me-2"></i>
              <a
                href="https://github.com/compakt06"
                target="_blank"
                rel="noreferrer"
                className="text-danger text-decoration-none"
              >
                github.com/yourname
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
