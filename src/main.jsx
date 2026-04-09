//Name: Natalie Kanyuchi
//Student ID: 23198994
//Description: Entry point of the react application
//this file render the root app component into the DOM using react

import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDom.createRoot(document.getElementById("root")).render(
  /**a wrapper to check for problems in the app during development
   * doesnt not render any visible ui but activates warningg
   */
  <React.StrictMode>
    {/*component containing all other pages and logic*/}
    <App />

  </React.StrictMode>
);