// Name: Natalie Kanyuchi
// Student ID number: 23198994
// Description: Fare estimation page for the CabsOnline application.
// This component allows users to select a pickup suburb, destination suburb,
// and vehicle type, then calculates and displays an estimated fare.

import { useState } from "react";
import { suburbs } from "../components/Suburbs";
import { calculateEstimatedFare } from "../components/FareCalculator";

function FarePage() {
  // Store the selected trip details
  const [form, setForm] = useState({
    pickup: "",
    destination: "",
    carType: "Standard"
  });

  // Store the calculated fare and user feedback message
  const [fare, setFare] = useState(null);
  const [message, setMessage] = useState("");

  // Update form state when inputs change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Calculate fare based on selected suburbs and vehicle type
  function handleFareSubmit(e) {
    e.preventDefault();

    if (!form.pickup || !form.destination) {
      setMessage("Please select both pickup and destination suburbs.");
      setFare(null);
      return;
    }

    if (form.pickup === form.destination) {
      setMessage("Pickup and destination cannot be the same.");
      setFare(null);
      return;
    }

    const estimatedFare = calculateEstimatedFare(
      form.pickup,
      form.destination,
      form.carType
    );

    if (!estimatedFare) {
      setMessage("Unable to calculate fare for the selected trip.");
      setFare(null);
      return;
    }

    setFare(estimatedFare);
    setMessage("Estimated fare calculated successfully.");
  }

  return (
    <div className="page-card">
      <h2>Fare Estimate</h2>
      <p className="section-subtitle">
        Estimate your trip cost before booking.
      </p>

      <form className="fare-form" onSubmit={handleFareSubmit}>
        <select name="pickup" value={form.pickup} onChange={handleChange}>
          <option value="">Select pickup suburb</option>
          {suburbs.map((suburb) => (
            <option key={suburb} value={suburb}>
              {suburb}
            </option>
          ))}
        </select>

        <select name="destination" value={form.destination} onChange={handleChange}>
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

        <button type="submit">Estimate Fare</button>
      </form>

      {message && <div className="message-box">{message}</div>}

      {fare && (
        <div className="fare-summary">
          <h3>Trip Summary</h3>
          <p><strong>Pickup:</strong> {form.pickup}</p>
          <p><strong>Destination:</strong> {form.destination}</p>
          <p><strong>Car Type:</strong> {form.carType}</p>
          <p><strong>Estimated Fare:</strong> NZD ${fare}</p>
        </div>
      )}
    </div>
  );
}

export default FarePage;