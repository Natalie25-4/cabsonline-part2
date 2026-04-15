//Natalie Kanyuchi
//Student id number: 23198894
//description: payment simulation page
//allows customer to search for a ooking by phone number
//view unpaid bookings, and simulate a payment using the stored fare amount 

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

function PaymentPage() {
  // Search state, booking results, payment form, and feedback
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    paymentMethod: "Credit Card"
  });

  const [selectedBrn, setSelectedBrn] = useState("");

  // Search bookings by phone number
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

  // Load chosen booking for payment
  function startPayment(booking) {
    if (booking.status === "cancelled") {
      setMessage("Cancelled bookings cannot be paid.");
      return;
    }

    if (booking.payment_status === "paid") {
      setMessage("This booking has already been paid.");
      return;
    }

    setSelectedBrn(booking.brn);
    setPaymentForm({
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      paymentMethod: "Credit Card"
    });
  }

  // Handle payment input changes
  function handleChange(e) {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
  }

  // Simulate payment and update booking status
  async function handlePayment(e) {
    e.preventDefault();

    if (!selectedBrn) {
      setMessage("Please select a booking to pay for.");
      return;
    }

    if (
      !paymentForm.cardName ||
      !paymentForm.cardNumber ||
      !paymentForm.expiry ||
      !paymentForm.cvv
    ) {
      setMessage("Please complete all payment fields.");
      return;
    }

    if (!/^\d{16}$/.test(paymentForm.cardNumber.replace(/\s/g, ""))) {
      setMessage("Card number must contain 16 digits.");
      return;
    }

    if (!/^\d{3,4}$/.test(paymentForm.cvv)) {
      setMessage("CVV must contain 3 or 4 digits.");
      return;
    }

    const { error } = await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        payment_method: paymentForm.paymentMethod
      })
      .eq("brn", selectedBrn);

    if (error) {
      console.error(error);
      setMessage("Payment failed.");
      return;
    }

    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.brn === selectedBrn
          ? {
              ...booking,
              payment_status: "paid",
              payment_method: paymentForm.paymentMethod
            }
          : booking
      )
    );

    setMessage(`Payment for booking ${selectedBrn} was completed successfully.`);
    setSelectedBrn("");
    setPaymentForm({
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      paymentMethod: "Credit Card"
    });
  }

  const selectedBooking = bookings.find((booking) => booking.brn === selectedBrn);

  return (
    <div className="page-card">
      <h2>Payment</h2>
      <p className="section-subtitle">
        Enter your phone number to view bookings and complete payment.
      </p>

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

      {bookings.length === 0 && (
        <div className="empty-state">
          <p>Enter your phone number to view bookings available for payment.</p>
        </div>
      )}

      {message && <div className="message-box">{message}</div>}

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
            <div><strong>Fare:</strong> {booking.fare_amount ? `NZD $${Number(booking.fare_amount).toFixed(2)}` : "Not available"}</div>
            <div><strong>Payment:</strong> {booking.payment_status || "unpaid"}</div>
          </div>

          {booking.status !== "cancelled" && booking.payment_status !== "paid" && (
            <div className="button-row">
              <button
                type="button"
                className="action-btn"
                onClick={() => startPayment(booking)}
              >
                Pay Now
              </button>
            </div>
          )}
        </div>
      ))}

      {selectedBooking && (
        <div className="payment-summary">
          <h3>Payment Summary ({selectedBooking.brn})</h3>
          <p><strong>Customer:</strong> {selectedBooking.cname}</p>
          <p><strong>Pickup:</strong> {selectedBooking.sbname}</p>
          <p><strong>Destination:</strong> {selectedBooking.dsbname}</p>
          <p><strong>Amount Due:</strong> NZD ${Number(selectedBooking.fare_amount).toFixed(2)}</p>

          <form className="payment-form" onSubmit={handlePayment}>
            <select
              name="paymentMethod"
              value={paymentForm.paymentMethod}
              onChange={handleChange}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>

            <input
              type="text"
              name="cardName"
              placeholder="Cardholder Name"
              value={paymentForm.cardName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={paymentForm.cardNumber}
              onChange={handleChange}
            />

            <input
              type="text"
              name="expiry"
              placeholder="Expiry Date (MM/YY)"
              value={paymentForm.expiry}
              onChange={handleChange}
            />

            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={paymentForm.cvv}
              onChange={handleChange}
            />

            <button type="submit" className="pay-btn">
              Confirm Payment
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;