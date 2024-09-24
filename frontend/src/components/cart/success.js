import React from "react";
import "./success.css"; // Import CSS file for styling

export default function Success() {
  return (
    <div className="centered-container">
      <div className="gif-container">
        <img
          src="./images/success.png"
          alt="Successfully Done"
          className="gif-image"
        />
      </div>
    </div>
  );
}
