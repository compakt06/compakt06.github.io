import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Projects() {
  return (
    <>
      <Navbar />
      <div
        className="d-flex flex-column justify-content-center align-items-center bg-danger-subtle text-center p-3 vh-100 overflow-hidden"
        style={{ paddingTop: "56px" }} // wysokość navbaru fixed-top
      >
        <div
          className="bg-white bg-opacity-10 rounded-4 shadow p-5"
          style={{ maxWidth: "400px", cursor: "pointer", transition: "transform 0.3s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Link
            to="/orders"
            className="text-danger text-decoration-none d-flex flex-column align-items-center"
          >
            <i className="bi bi-basket-fill fs-1 mb-3"></i>
            <h2>🍗 KFC Orders</h2>
          </Link>
        </div>
      </div>
    </>
  );
}
