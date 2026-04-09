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
import TrackingPage from "./pages/TrackingPage";
import FarePage from "./pages/FarePage";

function App() {
  return (
    //enable navigation features + syncing the Ui with the url
    <BrowserRouter>
      <div className="layout">
        {/*navbar places at the top acrosss pages*/}
        <Navbar />
        {/*container for page-specific content*/}
        <main className="main-content">
          {/*routes acts as a containter for all page paths*/}
          <Routes>
            <Route path="/" element={<BookingPage />} /> //renders to booking page
            <Route path="/admin" element={<AdminPage />} /> //renders to admin page
            <Route path="/tracking" element={<TrackingPage />} /> //renders to tracking page
            <Route path="/fare" element={<FarePage />} /> //renders to fare page
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;