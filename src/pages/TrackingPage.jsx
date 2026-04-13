// Name: Natalie Kanyuchi
// Student ID number: 23198994
// Description: Customer booking management page.
// This component allows customers to search bookings by phone number,
// view booking details, update active bookings, cancel bookings,
// and permanently delete cancelled bookings.

import { useState } from "react";
import { supabase } from "../lib/supabase";

// Format Supabase datetime values into DD/MM/YYYY hh:mm AM/PM
function formatDateTime(datetime) {
  const date = new Date(datetime);

  const formattedDate = date.toLocaleDateString("en-GB");
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  return `${formattedDate} ${formattedTime}`;
}

function TrackingPage() {
  // Search input, feedback message, booking list, and loading state
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update form fields
  const [form, setForm] = useState({
    phone: "",
    dsbname: "",
    date: "",
    time: ""
  });

  // Stores the BRN of the booking currently being edited
  const [selectedBrn, setSelectedBrn] = useState("");

  // Search for bookings using the customer's phone number
  async function handleSearch(e) {
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

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Failed to retrieve bookings.");
      setBookings([]);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setMessage("No bookings found for this phone number.");
      setBookings([]);
      setLoading(false);
      return;
    }

    setBookings(data);
    setMessage(`Found ${data.length} booking(s) for ${phone}.`);
    setLoading(false);
  }

  // Load an existing booking into the update form
  function startUpdate(booking) {
    if (booking.status === "cancelled") {
      setMessage("Cancelled bookings cannot be edited.");
      return;
    }

    const dateObject = new Date(booking.pickup_datetime);
    const date = dateObject.toISOString().slice(0, 10);
    const time = dateObject.toTimeString().slice(0, 5);

    setSelectedBrn(booking.brn);
    setForm({
      phone: booking.phone || "",
      dsbname: booking.dsbname || "",
      date,
      time
    });
  }

  // Update local form state when fields change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Save updated booking details to Supabase
  async function handleUpdate(e) {
    e.preventDefault();

    if (!selectedBrn) {
      setMessage("Please select a booking to update.");
      return;
    }

    const selectedBooking = bookings.find((booking) => booking.brn === selectedBrn);

    if (selectedBooking && selectedBooking.status === "cancelled") {
      setMessage("Cancelled bookings cannot be edited.");
      return;
    }

    if (!form.phone || !form.dsbname || !form.date || !form.time) {
      setMessage("Please fill in all update fields.");
      return;
    }

    if (!/^\d{10,12}$/.test(form.phone)) {
      setMessage("Phone number must be 10–12 digits.");
      return;
    }

    const pickupDateTime = new Date(`${form.date}T${form.time}`);
    if (pickupDateTime < new Date()) {
      setMessage("Pickup date and time cannot be in the past.");
      return;
    }

    const pickup_datetime = `${form.date} ${form.time}:00`;

    const { error } = await supabase
      .from("bookings")
      .update({
        phone: form.phone,
        dsbname: form.dsbname,
        pickup_datetime
      })
      .eq("brn", selectedBrn);

    if (error) {
      console.error(error);
      setMessage("Failed to update booking.");
      return;
    }

    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.brn === selectedBrn
          ? {
              ...booking,
              phone: form.phone,
              dsbname: form.dsbname,
              pickup_datetime
            }
          : booking
      )
    );

    setMessage(`Booking ${selectedBrn} has been updated successfully.`);
    setSelectedBrn("");
    setForm({
      phone: "",
      dsbname: "",
      date: "",
      time: ""
    });
  }

  // Cancel a booking and release its assigned driver back to available
  async function handleCancel(brn, driverId) {
    const { error: bookingError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        driver_id: null,
        driver_name: null
      })
      .eq("brn", brn);

    if (bookingError) {
      console.error(bookingError);
      setMessage("Failed to cancel booking.");
      return;
    }

    if (driverId) {
      const { error: driverError } = await supabase
        .from("drivers")
        .update({ status: "available" })
        .eq("driver_id", driverId);

      if (driverError) {
        console.error(driverError);
        setMessage("Booking cancelled, but driver availability could not be updated.");
        return;
      }
    }

    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.brn === brn
          ? {
              ...booking,
              status: "cancelled",
              driver_id: null,
              driver_name: null
            }
          : booking
      )
    );

    if (selectedBrn === brn) {
      setSelectedBrn("");
      setForm({
        phone: "",
        dsbname: "",
        date: "",
        time: ""
      });
    }

    setMessage(`Booking ${brn} has been cancelled.`);
  }

  // Permanently delete a cancelled booking from Supabase and from the UI
  async function handleDelete(brn) {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("brn", brn);

    if (error) {
      console.error(error);
      setMessage("Failed to delete booking.");
      return;
    }

    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking.brn !== brn)
    );

    if (selectedBrn === brn) {
      setSelectedBrn("");
      setForm({
        phone: "",
        dsbname: "",
        date: "",
        time: ""
      });
    }

    setMessage(`Booking ${brn} has been deleted.`);
  }

  return (
    <div className="page-card">
      <h2>My Booking</h2>
      <p className="section-subtitle">
        Enter your phone number to track, update, or manage your bookings.
      </p>

      {/* Search form */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter phone number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Empty state before or after unsuccessful search */}
      {bookings.length === 0 && (
        <div className="empty-state">
          <p>Enter your phone number to view your bookings.</p>
        </div>
      )}

      {/* Feedback message */}
      {message && <div className="message-box">{message}</div>}

      {/* Display each booking found for the phone number */}
      {bookings.map((booking) => (
        <div key={booking.brn} className="admin-section">
          <h3>Booking Details ({booking.brn})</h3>

          <div className="info-grid">
            <div><strong>Customer:</strong> {booking.cname}</div>
            <div><strong>Phone:</strong> {booking.phone}</div>
            <div><strong>Pickup Suburb:</strong> {booking.sbname || "Not provided"}</div>
            <div><strong>Destination:</strong> {booking.dsbname || "Not provided"}</div>
            <div><strong>Pickup Time:</strong> {formatDateTime(booking.pickup_datetime)}</div>
            <div><strong>Status:</strong> {booking.status}</div>
            <div><strong>Driver:</strong> {booking.driver_name || "Not assigned yet"}</div>
          </div>

          <div className="button-row">
            <button
              type="button"
              className="action-btn"
              onClick={() => startUpdate(booking)}
              disabled={booking.status === "cancelled"}
            >
              Edit Booking
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => handleCancel(booking.brn, booking.driver_id)}
              disabled={booking.status === "cancelled"}
            >
              {booking.status === "cancelled" ? "Cancelled" : "Cancel Booking"}
            </button>

            {booking.status === "cancelled" && (
              <button
                type="button"
                className="delete-btn"
                onClick={() => handleDelete(booking.brn)}
              >
                Delete Booking
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Update form appears only when a booking is selected for editing */}
      {selectedBrn && (
        <div className="admin-section">
          <h3>Update Booking ({selectedBrn})</h3>

          <form className="update-form" onSubmit={handleUpdate}>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="dsbname"
              placeholder="Destination Suburb"
              value={form.dsbname}
              onChange={handleChange}
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
            />

            <div className="button-row">
              <button type="submit" className="action-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TrackingPage;