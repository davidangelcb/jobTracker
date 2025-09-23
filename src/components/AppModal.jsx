import React from "react";
import "./AppModal.css";

function AppModal({ show, onClose }) {
  if (!show) return null; // si no está activo, no se renderiza

  return (
    <div className="appmodal_overlay">
      <div className="appmodal_content">
        {/* Botón cerrar */}
        <button className="appmodal_close" onClick={onClose}>
          ×
        </button>

        <div className="appmodal_icon">
          <span role="img" aria-label="camera">📷</span>
        </div>

        <h2 className="appmodal_title">Submit Before Photos</h2>
        <p className="appmodal_text">
          Please take the required photos: Front Door, Kitchen, Bedrooms,
          Bathrooms, and Living Room.
        </p>

        <ol className="appmodal_list">
          <li>Capture photos of each space (you may add extras if needed).</li>
          <li>Click Submit Before Photos to continue.</li>
        </ol>

        <div className="appmodal_footer">
          <label className="appmodal_checkbox">
            <input type="checkbox" /> Don't show this again
          </label>
          <button className="appmodal_ok" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppModal;
