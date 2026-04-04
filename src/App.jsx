import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/NavBar";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import TrackingPage from "./pages/TrackingPage";
import FarePage from "./pages/FarePage";

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/fare" element={<FarePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;