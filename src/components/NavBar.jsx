//Name: Natalie Kanyuchi
//Student ID number: 23198994
//Description: navigation bar component for the web application
//provides the links to different pages which includes booking, my booking, admin etc

import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    // Main navigation container providing links to all key application pages
    <nav className="nav">
      {/* Application branding displayed on the navigation bar */}
      <div className="nav-brand">CabsOnline</div>

      {/* Navigation links for routing between different features */}
      <div className="nav-links">
        {/* Link to booking page where customers can create a new cab booking */}
        <NavLink to="/" className="nav-link">
          Booking
        </NavLink>

        {/* Link to tracking page allowing customers to view and track their booking status */}
        <NavLink to="/tracking" className="nav-link">
          My Booking
        </NavLink>

        {/* Link to fare estimation page where users can calculate estimated trip cost */}
        <NavLink to="/fare" className="nav-link">
          Fare Estimate
        </NavLink>

        {/* Link to admin dashboard for managing bookings and assigning drivers */}
        <NavLink to="/payment" className="nav-link">
          Payment
        </NavLink>

        {/* Link to the payment page for payment simulation*/}
        <NavLink to="/admin" className="nav-link">
          Admin
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;