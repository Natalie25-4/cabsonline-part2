import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-brand">CabsOnline</div>

      <div className="nav-links">
        <NavLink to="/" className="nav-link">
          Booking
        </NavLink>
        <NavLink to="/admin" className="nav-link">
          Admin
        </NavLink>
        <NavLink to="/tracking" className="nav-link">
          My Booking
        </NavLink>
        <NavLink to="/fare" className="nav-link">
          Fare Estimate
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;