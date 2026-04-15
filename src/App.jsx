//Name: Natalie Kanyuchi
//Student ID number: 23198994
//Description: main application component
//this file defins the layout and routing structure of the app
//includes navigation between booking, admin, tracking and fare pages

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/NavBar";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import MyBooking from "./pages/MyBooking";
import FarePage from "./pages/FarePage";
import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/tracking" element={<MyBooking />} />
            <Route path="/fare" element={<FarePage />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;