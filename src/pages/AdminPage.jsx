//Name: Natalie Kanyuchi
//Student ID number: 23198994
//description: admin dashboard component
//allows admin to search bookings by reference number,
//assign bookings, assign drivers and unassign drivers
//makes sure only one driver is assigned per booking

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Formats a datetime string into user friendly display format
 * output example: dd/mm/yyyy 10:30am
 */
function formatDateTime(datetime) {
  const date = new Date(datetime);

  //format date to dd/mm/yyyy
  const formattedDate = date.toLocaleDateString("en-GB");
  //format time to 12 hour format with am/pm
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  return `${formattedDate} ${formattedTime}`;
}

function AdminPage() {
  // stores the user input for searching booking reference number(brn)
  const [search, setSearch] = useState("");
  //stores feedback and error messages to show to user
  const [message, setMessage] = useState("");
  //stores booking details retrieved from supabase based on search
  const [booking, setBooking] = useState(null);
  //stores the list of drivers retrieved from the DB
  const [drivers, setDrivers] = useState([]);
  //tracks if a search is currently in progress
  const [loading, setLoading] = useState(false);

/**
 * fetches driver data from the database when the component mounts
 * this ensures that the admin has access to the latest driver availability
 */
  useEffect(() => {
    async function loadDrivers() {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("driver_id", { ascending: true });

      if (error) {
        console.error(error);
        setMessage("Failed to load drivers.");
        return;
      }

      setDrivers(data || []);
    }

    loadDrivers();
  }, []); //runs only once when component mounts

/**
 * Handles booking search functionality using brn input
 * validates the input and retrieves booking data from database
 */
  async function handleSearch(e) {
    e.preventDefault(); //prevent default form reload

    const trimmedSearch = search.trim();

    //validate empty input
    if (!trimmedSearch) {
      setMessage("Please enter a booking reference number.");
      setBooking(null);
      return;
    }
    //validate brn format e.g BRN00001
    if (!/^BRN\d{5}$/.test(trimmedSearch)) {
      setMessage("Invalid BRN format. Please enter a valid BRN (e.g. BRN00001).");
      setBooking(null);
      return;
    }

    setLoading(true);
    setMessage("");

    //query booking from the database
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("brn", trimmedSearch)
      .single(); 

    if (error || !data) {
      console.error(error);
      setMessage("Booking not found.");
      setBooking(null);
      setLoading(false);
      return;
    }
//store retrieved booking in state
    setBooking(data);
    setMessage(`Booking ${trimmedSearch} found.`);
    setLoading(false);
  }

/**
 * updates booking status to assigned without assigning a driver yet.
 *  */  
   async function assignBooking() {
    if (!booking) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "assigned" })
      .eq("brn", booking.brn);

    if (error) {
      console.error(error);
      setMessage("Failed to assign booking.");
      return;
    }

    //sync local state with the updated booking status
    setBooking({ ...booking, status: "assigned" });
    setMessage(`Booking request ${booking.brn} has been assigned.`);
  }

  /**
   * assigns a driver to a booking
   * includes validation so that only one driver is assigned per booking
   * and that the driver is available
   */
  async function assignDriver(driver) {
    if (!booking) {
      setMessage("Search for a booking before assigning a driver.");
      return;
    }

    if (booking.driver_id) { //validation for checking if booking already has a driver assigned
      setMessage(
        "A driver is already assigned to this booking. Unassign the current driver first if you want to change drivers."
      );
      return;
    }

    if (driver.status !== "available") { //validation to check is a driver is available before assigning
      setMessage("This driver is not available. Please select another driver.");
      return;
    }

    //update the booking with assigned driver and change status to assigned, then update the drivers status to unavailable
    const { error: bookingError } = await supabase
      .from("bookings")
      .update({
        status: "assigned",
        driver_id: driver.driver_id,
        driver_name: driver.driver_name
      })
      .eq("brn", booking.brn);

    if (bookingError) {
      console.error(bookingError);
      setMessage("Failed to assign driver to booking.");
      return;
    }

    //update drivers status to unavailable if assigned to a booking
    const { error: driverError } = await supabase
      .from("drivers")
      .update({ status: "unavailable" })
      .eq("driver_id", driver.driver_id);

    if (driverError) {
      console.error(driverError);
      setMessage("Driver assignment updated booking, but driver status failed.");
      return;
    }

    //sync local react state
    //update the booking details
    setBooking({
      ...booking,
      status: "assigned",
      driver_id: driver.driver_id,
      driver_name: driver.driver_name
    });

    //update driver list to show driver is unavailable
    setDrivers((prevDrivers) =>
      prevDrivers.map((d) =>
        d.driver_id === driver.driver_id ? { ...d, status: "unavailable" } : d
      )
    );

    setMessage(`${driver.driver_name} has been assigned to booking ${booking.brn}.`);
  }

/**unassigns driver from a booking and restores driver availability
 *  */  
  async function unassignDriver() {
    if (!booking || !booking.driver_id) {
      setMessage("No driver is currently assigned to this booking.");
      return;
    }

    const currentDriverId = booking.driver_id;
    const currentDriverName = booking.driver_name;

    //remove driver from booking and resets status
    const { error: bookingError } = await supabase
      .from("bookings")
      .update({
        driver_id: null,
        driver_name: null,
        status: "unassigned"
      })
      .eq("brn", booking.brn);

    if (bookingError) {
      console.error(bookingError);
      setMessage("Failed to unassign driver from booking.");
      return;
    }

    // make the driver available again in the drivers table
    const { error: driverError } = await supabase
      .from("drivers")
      .update({ status: "available" })
      .eq("driver_id", currentDriverId);

    if (driverError) {
      console.error(driverError);
      setMessage("Booking updated, but driver availability could not be restored.");
      return;
    }

    //sync local state
    setBooking({
      ...booking,
      driver_id: null,
      driver_name: null,
      status: "unassigned"
    });

    setDrivers((prevDrivers) =>
      prevDrivers.map((d) =>
        d.driver_id === currentDriverId ? { ...d, status: "available" } : d
      )
    );

    setMessage(`${currentDriverName} has been unassigned from booking ${booking.brn}.`);
  }

  return (
    <div className="page-card">
      <h2>Admin Dashboard</h2>
      <p className="section-subtitle">
        Search for a booking reference number to manage a booking.
      </p>
      {/*search section*/}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter BRN number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {!booking && (
        <div className="empty-state">
          <p>Enter a booking reference number to view booking details.</p>
        </div>
      )}

      {message && <div className="message-box">{message}</div>}

{/*booking details to display only shows if a booking is loading*/}
      {booking && (
        <div className="admin-section">
          <h3>Booking Details</h3>
          <div className="info-grid">
            <div><strong>Reference:</strong> {booking.brn}</div>
            <div><strong>Customer:</strong> {booking.cname}</div>
            <div><strong>Phone:</strong> {booking.phone}</div>
            <div><strong>Pickup Suburb:</strong> {booking.sbname || "Not provided"}</div>
            <div><strong>Destination:</strong> {booking.dsbname || "Not provided"}</div>
            <div><strong>Pickup Time:</strong> {formatDateTime(booking.pickup_datetime)}</div>
            <div><strong>Status:</strong> {booking.status}</div>
            <div><strong>Driver:</strong> {booking.driver_name || "Unassigned"}</div>
          </div>

          <div className="button-row">
            {/*show assing booking only if it is not unassigned*/}
            {booking.status === "unassigned" && !booking.driver_id && (
              <button className="action-btn" onClick={assignBooking}>
                Assign Booking
              </button>
            )}
            {/*show unassign if driver is not linked*/}
            {booking.driver_id && (
              <button type="button" className="cancel-btn" onClick={unassignDriver}>
                Unassign Driver
              </button>
            )}
          </div>
        </div>
      )}

{/*driver managment section*/}
      <div className="admin-section">
        <h3>Available Drivers</h3>
        <div className="driver-list">
          {drivers.map((driver) => (
            <div className="driver-card" key={driver.driver_id}>
              <p><strong>ID:</strong> {driver.driver_id}</p>
              <p><strong>Name:</strong> {driver.driver_name}</p>
              <p><strong>Area:</strong> {driver.area}</p>
              <p><strong>Status:</strong> {driver.status}</p>
{/*disable button if driver is busy/ set to unavailable*/}
              <button
                type="button"
                disabled={driver.status !== "available"}
                onClick={() => assignDriver(driver)}
              >
                Assign Driver
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;