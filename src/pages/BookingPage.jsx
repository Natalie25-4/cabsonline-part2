// Name: Natalie Kanyuchi
// Student ID number: 23198994
// Description: Booking page component.
// Allows users to enter booking details, validates input,
// generates a booking reference number, calculates fare,
// and stores booking data in Supabase.

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { suburbs } from "../components/Suburbs";
import { calculateEstimatedFare } from "../components/FareCalculator";

function BookingPage() {
  // Store form values for a new booking
  const [form, setForm] = useState({
    cname: "",
    phone: "",
    snumber: "",
    stname: "",
    sbname: "",
    dsbname: "",
    date: "",
    time: "",
    carType: "Standard"
  });

  // Store feedback message and loading state
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form state when user changes an input field
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle booking submission and save the record in Supabase
  async function handleSubmit(e) {
    e.preventDefault();

    if (!/^\d{10,12}$/.test(form.phone)) {
      setMessage("Phone number must be 10–12 digits.");
      return;
    }

    if (
      !form.cname ||
      !form.snumber ||
      !form.stname ||
      !form.sbname ||
      !form.dsbname ||
      !form.date ||
      !form.time
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (form.sbname === form.dsbname) {
      setMessage("Pickup and destination suburbs cannot be the same.");
      return;
    }

    const pickupDateTime = new Date(`${form.date}T${form.time}`);
    if (pickupDateTime < new Date()) {
      setMessage("Pickup date and time cannot be in the past.");
      return;
    }

    const fareAmount = calculateEstimatedFare(form.sbname, form.dsbname, form.carType);

    if (!fareAmount) {
      setMessage("Unable to calculate fare for the selected trip.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Get the most recent BRN to generate the next booking reference number
      const { data: existingBookings, error: fetchError } = await supabase
        .from("bookings")
        .select("brn")
        .order("id", { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error("Fetch BRN error:", fetchError);
        setMessage(`Failed to generate booking reference: ${fetchError.message}`);
        setLoading(false);
        return;
      }

      let nextNumber = 1;

      if (existingBookings && existingBookings.length > 0) {
        const latestBrn = existingBookings[0]?.brn || "BRN00000";
        const numericPart = parseInt(latestBrn.replace("BRN", ""), 10) || 0;
        nextNumber = numericPart + 1;
      }

      const brn = "BRN" + String(nextNumber).padStart(5, "0");
      const pickup_datetime = `${form.date} ${form.time}:00`;

      // Insert the booking into the bookings table
      const { error: insertError } = await supabase.from("bookings").insert([
        {
          brn,
          cname: form.cname,
          phone: form.phone,
          snumber: form.snumber,
          stname: form.stname,
          sbname: form.sbname,
          dsbname: form.dsbname,
          pickup_datetime,
          status: "unassigned",
          driver_id: null,
          driver_name: null,
          fare_amount: fareAmount,
          payment_status: "unpaid",
          payment_method: null
        }
      ]);

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        setMessage(`Failed to create booking: ${insertError.message}`);
        setLoading(false);
        return;
      }

      const formattedDate = new Date(form.date).toLocaleDateString("en-GB");
      const formattedTime = new Date(`${form.date}T${form.time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });

      setMessage(
        `Thank you for your booking!
Booking reference number: ${brn}
Pickup time: ${formattedTime}
Pickup date: ${formattedDate}
Estimated fare: NZD $${Number(fareAmount).toFixed(2)}`
      );

      // Reset form after successful booking
      setForm({
        cname: "",
        phone: "",
        snumber: "",
        stname: "",
        sbname: "",
        dsbname: "",
        date: "",
        time: "",
        carType: "Standard"
      });
    } catch (error) {
      console.error("Booking creation error:", error);
      setMessage(`Something went wrong while creating the booking: ${error.message}`);
    }

    setLoading(false);
  }

  return (
    <div className="page-card">
      <h2>Book a Taxi</h2>
      <p className="section-subtitle">
        Enter your details below to book a taxi service.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <input
          name="cname"
          placeholder="Customer Name"
          value={form.cname}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="snumber"
          placeholder="Street Number"
          value={form.snumber}
          onChange={handleChange}
        />

        <input
          name="stname"
          placeholder="Street Name"
          value={form.stname}
          onChange={handleChange}
        />

        <select name="sbname" value={form.sbname} onChange={handleChange}>
          <option value="">Select pickup suburb</option>
          {suburbs.map((suburb) => (
            <option key={suburb} value={suburb}>
              {suburb}
            </option>
          ))}
        </select>

        <select name="dsbname" value={form.dsbname} onChange={handleChange}>
          <option value="">Select destination suburb</option>
          {suburbs.map((suburb) => (
            <option key={suburb} value={suburb}>
              {suburb}
            </option>
          ))}
        </select>

        <select name="carType" value={form.carType} onChange={handleChange}>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="Van">Van</option>
        </select>

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

        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Taxi"}
        </button>
      </form>

      {message && <div className="message-box">{message}</div>}
    </div>
  );
}

export default BookingPage;