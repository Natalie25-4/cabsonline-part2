import { useState } from "react";

function AdminPage() {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(null);

  const [drivers, setDrivers] = useState([
    { id: "D001", name: "Elizabeth Basil", area: "South Auckland", status: "available" },
    { id: "D002", name: "Natalia Robinson", area: "North Auckland", status: "available" },
    { id: "D003", name: "Hannah Grace", area: "East Auckland", status: "available" },
    { id: "D004", name: "Ava Wilson", area: "West Auckland", status: "available" },
    { id: "D005", name: "Emily Davis", area: "Central Auckland", status: "available" },
    { id: "D006", name: "Sophia Johnson", area: "South Auckland", status: "available" },
    { id: "D007", name: "Oliva Brown", area: "North Auckland", status: "available" },
    { id: "D008", name: "Annabelle Lee", area: "East Auckland", status: "available" },
    { id: "D009", name: "Tyler Smith", area: "West Auckland", status: "available" },
    { id: "D010", name: "Liam Wilson", area: "Central Auckland", status: "available" }
  ]);

  function handleSearch(e) {
    e.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setMessage("Please enter a booking reference number.");
      setBooking(null);
      return;
    }

    if (!/^BRN\d{5}$/.test(trimmedSearch)) {
      setMessage("Invalid BRN format. Please enter a valid BRN (e.g. BRN00001).");
      setBooking(null);
      return;
    }

    // placeholder until backend is connected
    setBooking({
      brn: trimmedSearch,
      cname: "Customer Name",
      phone: "02000000000",
      sbname: "Pickup Suburb",
      dsbname: "Destination Suburb",
      pickup_datetime: "2026-04-15 14:00",
      status: "unassigned",
      driverId: "",
      driverName: ""
    });

    setMessage(`Booking ${trimmedSearch} found.`);
  }

  function assignBooking() {
    if (!booking) return;

    setBooking({ ...booking, status: "assigned" });
    setMessage(`Booking request ${booking.brn} has been assigned.`);
  }

  function assignDriver(driverId) {
    if (!booking) {
      setMessage("Search for a booking before assigning a driver.");
      return;
    }

    const selectedDriver = drivers.find((driver) => driver.id === driverId);

    if (!selectedDriver || selectedDriver.status !== "available") {
      setMessage("This driver is not available. Please select another driver.");
      return;
    }

    setBooking({
      ...booking,
      status: "assigned",
      driverId: selectedDriver.id,
      driverName: selectedDriver.name
    });

    const updatedDrivers = drivers.map((driver) =>
      driver.id === driverId ? { ...driver, status: "unavailable" } : driver
    );

    setDrivers(updatedDrivers);
    setMessage(`${selectedDriver.name} has been assigned to booking ${booking.brn}.`);
  }

  return (
    <div className="page-card">
      <h2>Admin Dashboard</h2>
      <p className="section-subtitle">
        Search for a booking reference number to manage a booking.
      </p>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter BRN number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {!booking && (
        <div className="empty-state">
          <p>Enter a booking reference number to view and manage a booking.</p>
        </div>
      )}

      {message && <div className="message-box">{message}</div>}

      {booking && (
        <div className="admin-section">
          <h3>Booking Details</h3>
          <div className="info-grid">
            <div><strong>Reference:</strong> {booking.brn}</div>
            <div><strong>Customer:</strong> {booking.cname}</div>
            <div><strong>Phone:</strong> {booking.phone}</div>
            <div><strong>Pickup Suburb:</strong> {booking.sbname}</div>
            <div><strong>Destination:</strong> {booking.dsbname}</div>
            <div><strong>Pickup Time:</strong> {booking.pickup_datetime}</div>
            <div><strong>Status:</strong> {booking.status}</div>
            <div><strong>Driver:</strong> {booking.driverName || "Unassigned"}</div>
          </div>

          {booking.status === "unassigned" && (
            <button className="action-btn" onClick={assignBooking}>
              Assign Booking
            </button>
          )}
        </div>
      )}

      <div className="admin-section">
        <h3>Available Drivers</h3>
        <div className="driver-list">
          {drivers.map((driver) => (
            <div className="driver-card" key={driver.id}>
              <p><strong>ID:</strong> {driver.id}</p>
              <p><strong>Name:</strong> {driver.name}</p>
              <p><strong>Area:</strong> {driver.area}</p>
              <p><strong>Status:</strong> {driver.status}</p>

              <button
                type="button"
                disabled={driver.status !== "available"}
                onClick={() => assignDriver(driver.id)}
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