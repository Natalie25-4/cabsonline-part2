//Name: Natalie Kanyuchi
//Student ID number: 23198994
//desciption: booking page component. allows users to enter booking details
//validates input and generates a booking reference number and stores booking data in supabase


import { useState } from "react";
import { supabase } from "../lib/supabase";

function BookingPage() {
  //initialise state for form fields
  const [form, setForm] = useState({
    cname: "",
    phone: "",
    snumber: "",
    stname: "",
    sbname: "",
    dsbname: "",
    date: "",
    time: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) { //update form fields in state when user types
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!/^\d{10,12}$/.test(form.phone)) { //validate phone number length (10-12 digits)
      setMessage("Phone number must be 10–12 digits.");
      return;
    }

    //ensure all mandatory fields are completed/filled
    if (!form.cname || !form.snumber || !form.stname || !form.date || !form.time) {
      setMessage("Please fill in all required fields.");
      return;
    }
   //prevent bookings from past dates and time
    const pickupDateTime = new Date(`${form.date}T${form.time}`);
    if (pickupDateTime < new Date()) {
      setMessage("Pickup date and time cannot be in the past.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // fetch most recent booking to determine the next booking reference number
      const { data: existingBookings, error: fetchError } = await supabase
        .from("bookings")
        .select("brn")
        .order("id", { ascending: false })
        .limit(1);

      if (fetchError) {
        setMessage("Failed to generate booking reference.");
        setLoading(false);
        return;
      }
//increment the numeric number of the latest BRN or start at number 1
      let nextNumber = 1;

      if (existingBookings && existingBookings.length > 0) {
        const latestBrn = existingBookings[0].brn;
        const numericPart = parseInt(latestBrn.replace("BRN", ""), 10);
        nextNumber = numericPart + 1;
      }
//format the new BRN with leadding zeros e.g BRN00001
      const brn = "BRN" + String(nextNumber).padStart(5, "0");
//combine date and time for database timestamp
      const pickup_datetime = `${form.date} ${form.time}:00`;
//insert the new booking record into the supabase database table
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
          driver_name: null
        }
      ]);

      if (insertError) {
        setMessage("Failed to create booking.");
        setLoading(false);
        return;
      }

      //show success message with formatted booking details
      const formattedDate = new Date(form.date).toLocaleDateString("en-GB");
      const formattedTime = form.time.slice(0, 5);

      //show message after booking has been made
      setMessage(
        `Thank you for your booking!
         Booking reference number: ${brn}
         Pickup time: ${formattedTime}
         Pickup date: ${formattedDate}`
      );
//clear the form field after booking has been made
      setForm({
        cname: "",
        phone: "",
        snumber: "",
        stname: "",
        sbname: "",
        dsbname: "",
        date: "",
        time: ""
      });
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while creating the booking.");
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

        <input
          name="sbname"
          placeholder="Suburb"
          value={form.sbname}
          onChange={handleChange}
        />

        <input
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

        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Taxi"}
        </button>
      </form>

      {message && <div className="message-box">{message}</div>}
    </div>
  );
}

export default BookingPage;