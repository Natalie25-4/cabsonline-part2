import { useState } from "react";

function TrackingPage() {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    phone: "",
    dsbname: "",
    date: "",
    time: ""
  });

  function handleSearch(e) {
    e.preventDefault();

    const phone = search.trim();

    if (!phone) {
      setMessage("Please enter your phone number.");
      setBookings([]);
      return;
    }

    if (!/^\d{10,12}$/.test(phone)) {
      setMessage("Phone number must be 10–12 digits.");
      setBookings([]);
      return;
    }

    // MOCK DATA (replace later with backend)
    const results = [
      {
        brn: "BRN00001",
        cname: "Natalie Kanyuchi",
        phone: phone,
        sbname: "Takanini",
        dsbname: "AUT City",
        pickup_datetime: "2026-04-20 14:30",
        status: "assigned",
        driverName: "Elizabeth Basil"
      }
    ];

    setBookings(results);
    setMessage(`Found ${results.length} booking(s) for ${phone}`);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleUpdate(index) {
    const updated = [...bookings];

    if (!form.phone || !form.dsbname || !form.date || !form.time) {
      setMessage("Please fill in all update fields.");
      return;
    }

    if (!/^\d{10,12}$/.test(form.phone)) {
      setMessage("Phone must be 10–12 digits.");
      return;
    }

    updated[index] = {
      ...updated[index],
      phone: form.phone,
      dsbname: form.dsbname,
      pickup_datetime: `${form.date} ${form.time}`
    };

    setBookings(updated);
    setMessage(`Booking ${updated[index].brn} updated.`);
  }

  function handleCancel(index) {
    const updated = [...bookings];

    updated[index] = {
      ...updated[index],
      status: "cancelled"
    };

    setBookings(updated);
    setMessage(`Booking ${updated[index].brn} cancelled.`);
  }

  return (
    <div className="page-card">
      <h2>My Booking</h2>
      <p className="section-subtitle">
        Enter your phone number to view and manage your bookings.
      </p>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter phone number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {bookings.length === 0 && (
        <div className="empty-state">
          <p>No bookings found yet.</p>
        </div>
      )}

      {message && <div className="message-box">{message}</div>}

      {bookings.map((booking, index) => (
        <div key={booking.brn} className="admin-section">
          <h3>Booking Details ({booking.brn})</h3>

          <div className="info-grid">
            <div><strong>Customer:</strong> {booking.cname}</div>
            <div><strong>Phone:</strong> {booking.phone}</div>
            <div><strong>Pickup:</strong> {booking.sbname}</div>
            <div><strong>Destination:</strong> {booking.dsbname}</div>
            <div><strong>Time:</strong> {booking.pickup_datetime}</div>
            <div><strong>Status:</strong> {booking.status}</div>
            <div><strong>Driver:</strong> {booking.driverName || "Not assigned"}</div>
          </div>

          <div className="admin-section">
            <h4>Update Booking</h4>

            <div className="update-form">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
              />
              <input
                type="text"
                name="dsbname"
                placeholder="Destination"
                onChange={handleChange}
              />
              <input
                type="date"
                name="date"
                onChange={handleChange}
              />
              <input
                type="time"
                name="time"
                onChange={handleChange}
              />

              <div className="button-row">
                <button
                  className="action-btn"
                  onClick={() => handleUpdate(index)}
                >
                  Update
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(index)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrackingPage;3