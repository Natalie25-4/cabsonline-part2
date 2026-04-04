import { useState } from "react";

function FarePage() {
  const [form, setForm] = useState({
    pickup: "",
    destination: "",
    carType: "Standard"
  });

  const [fare, setFare] = useState(null);
  const [message, setMessage] = useState("");

  const suburbZones = {
    "Auckland Central": 1,
    "North Auckland": 2,
    "South Auckland": 3,
    "East Auckland": 4,
    "West Auckland": 5,
    "Manukau": 6,
    "Papakura": 7,
    "Takanini": 8
  };

  const carTypeMultiplier = {
    Standard: 1,
    Premium: 1.35,
    Van: 1.6
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function calculateFare(e) {
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

    const pickupZone = suburbZones[form.pickup];
    const destinationZone = suburbZones[form.destination];

    const zoneDifference = Math.abs(pickupZone - destinationZone);
    const baseFare = 12;
    const distanceFare = zoneDifference * 4.5;
    const estimatedFare = (baseFare + distanceFare) * carTypeMultiplier[form.carType];

    setFare(estimatedFare.toFixed(2));
    setMessage("Estimated fare calculated successfully.");
  }

  return (
    <div className="page-card">
      <h2>Fare Estimate</h2>
      <p className="section-subtitle">
        Estimate your trip cost before booking.
      </p>

      <form className="fare-form" onSubmit={calculateFare}>
        <select name="pickup" value={form.pickup} onChange={handleChange}>
          <option value="">Select pickup suburb</option>
          <option value="Auckland Central">Auckland Central</option>
          <option value="North Auckland">North Auckland</option>
          <option value="South Auckland">South Auckland</option>
          <option value="East Auckland">East Auckland</option>
          <option value="West Auckland">West Auckland</option>
          <option value="Manukau">Manukau</option>
          <option value="Papakura">Papakura</option>
          <option value="Takanini">Takanini</option>
        </select>

        <select name="destination" value={form.destination} onChange={handleChange}>
          <option value="">Select destination suburb</option>
          <option value="Auckland Central">Auckland Central</option>
          <option value="North Auckland">North Auckland</option>
          <option value="South Auckland">South Auckland</option>
          <option value="East Auckland">East Auckland</option>
          <option value="West Auckland">West Auckland</option>
          <option value="Manukau">Manukau</option>
          <option value="Papakura">Papakura</option>
          <option value="Takanini">Takanini</option>
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