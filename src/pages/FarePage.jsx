// Name: Natalie Kanyuchi
// Student ID number: 23198994
// Description: fare estimation page
//calculates trip costs based on picup location and destination location + car type
//shows estimated fare

import { useState } from "react";

function FarePage() {
  //manage state for pickup, destination and selected vehicle type
  const [form, setForm] = useState({
    pickup: "",
    destination: "",
    carType: "Standard"
  });

  const [fare, setFare] = useState(null);
  const [message, setMessage] = useState("");
//assign numeric values to region to calculate distance based on zone difference
  const suburbZones = {
    "Pukekohe": 1,
    "Papakura":1,
    "Takaanini": 1,
    "Te Mahia":2,
    "Manurewa": 2,
    "Homai":2,
    "Puhinui":2,
    "Papatoetoe":3,
    "Middlemore":4,
    "Otahuhu": 5,
    "Penrose":5,
    "Ellerslie":6,
    "Greenlane":7,
    "Remuera": 8,
    "Newmarket": 9,
    "Parnell":10,
    "Waitemata": 11,


  };
//price multiplies based on the selected vehicle type
  const carTypeMultiplier = {
    Standard: 1,
    Premium: 1.35,
    Van: 1.6
  };

  //update form state on input change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
//hand fare calculation logic
  function calculateFare(e) {
    e.preventDefault();
//ensure user has selected both locations
    if (!form.pickup || !form.destination) {
      setMessage("Please select both pickup and destination suburbs.");
      setFare(null);
      return;
    }
//prevent calculation if pickup and destination are the same
    if (form.pickup === form.destination) {
      setMessage("Pickup and destination cannot be the same.");
      setFare(null);
      return;
    }
//fetch zone numbers for the selected suburbs
    const pickupZone = suburbZones[form.pickup];
    const destinationZone = suburbZones[form.destination];
//calculation logic = base fee + (zone difference * rate) * vehicle multiplier
    const zoneDifference = Math.abs(pickupZone - destinationZone);
    const baseFare = 12;
    const distanceFare = zoneDifference * 4.5;
    const estimatedFare = (baseFare + distanceFare) * carTypeMultiplier[form.carType];
//store final fare rounded to two decimal places
    setFare(estimatedFare.toFixed(2));
    setMessage("Estimated fare calculated successfully.");
  }

  return (
    <div className="page-card">
      <h2>Fare Estimate</h2>
      <p className="section-subtitle">
        Estimate your trip cost before booking.
      </p>
{/*input form for fare parameters*/}
      <form className="fare-form" onSubmit={calculateFare}>
        <select name="pickup" value={form.pickup} onChange={handleChange}>
          <option value="">Select pickup suburb</option>
          {/*suburb option*/}
          <option value="Pukekohe">Pukekohe</option>
          <option value="Papakura">Papakura</option>
          <option value="Takaanini">Takaanini</option>
          <option value="Te Mahia">Te Mahia</option>
          <option value="Manurewa">Manurewa</option>
          <option value="Homai">Homai</option>
          <option value="Puhinui">Puhinui</option>
          <option value="Papatoetoe">Papatoetoe</option>
          <option value="Middlemore">Middlemore</option>
          <option value="Otahuhu">Otahuhu</option>
          <option value="Penrose">Penrose</option>
          <option value="Ellerslie">Ellerslie</option>
          <option value="Greenlane">Greenlane</option>
          <option value="Remuera">Remuera</option>
          <option value="Newmarket">Newmarket</option>
          <option value="Parnell">Parnell</option>
          <option value="Waitemata">Waitemata</option>

        </select>

        <select name="destination" value={form.destination} onChange={handleChange}>
          <option value="">Select destination suburb</option>
          {/*suburb destination option*/}
          <option value="Pukekohe">Pukekohe</option>
          <option value="Papakura">Papakura</option>
          <option value="Takaanini">Takaanini</option>
          <option value="Te Mahia">Te Mahia</option>
          <option value="Manurewa">Manurewa</option>
          <option value="Homai">Homai</option>
          <option value="Puhinui">Puhinui</option>
          <option value="Papatoetoe">Papatoetoe</option>
          <option value="Middlemore">Middlemore</option>
          <option value="Otahuhu">Otahuhu</option>
          <option value="Penrose">Penrose</option>
          <option value="Ellerslie">Ellerslie</option>
          <option value="Greenlane">Greenlane</option>
          <option value="Remuera">Remuera</option>
          <option value="Newmarket">Newmarket</option>
          <option value="Parnell">Parnell</option>
          <option value="Waitemata">Waitemata</option>


        </select>
{/*vehicle type selection dropdown*/}
        <select name="carType" value={form.carType} onChange={handleChange}>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="Van">Van</option>
        </select>

        <button type="submit">Estimate Fare</button>
      </form>
{/*validation or status messages*/}
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