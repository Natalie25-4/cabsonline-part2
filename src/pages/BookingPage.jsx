import { useState } from "react";

function BookingPage() {
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // validation
    if (!/^\d{10,12}$/.test(form.phone)) {
      setMessage("Phone must be 10–12 digits.");
      return;
    }

    if (!form.cname || !form.snumber || !form.stname || !form.date || !form.time) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const brn = "BRN" + Math.floor(10000 + Math.random() * 90000);

    setMessage(
      `Booking confirmed!
Reference: ${brn}
Pickup: ${form.date} ${form.time}`
    );

    // reset
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
  }

  return (
    <div className="page-card">
      <h2>Book a Taxi</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input name="cname" placeholder="Customer Name" value={form.cname} onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />

        <input name="snumber" placeholder="Street Number" value={form.snumber} onChange={handleChange} />
        <input name="stname" placeholder="Street Name" value={form.stname} onChange={handleChange} />

        <input name="sbname" placeholder="Suburb" value={form.sbname} onChange={handleChange} />
        <input name="dsbname" placeholder="Destination Suburb" value={form.dsbname} onChange={handleChange} />

        <input type="date" name="date" value={form.date} onChange={handleChange} />
        <input type="time" name="time" value={form.time} onChange={handleChange} />

        <button type="submit">Book Taxi</button>
      </form>

      {message && <div className="message-box">{message}</div>}
    </div>
  );
}

export default BookingPage;