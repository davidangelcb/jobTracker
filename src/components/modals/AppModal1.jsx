import { useEffect, useState } from "react";
import "./AppModal.css";

function AppModal1({ show, onClose, onDontShowAgain  }) {
  const [checked, setChecked] = useState(false);

  if (!show) return null;

  const handleOk = () => {
    if (checked && onDontShowAgain) {
      onDontShowAgain(); // dispara la acción extra si está marcado
    }
    onClose(); // cierra siempre el modal
  };

  return (
    <div className="appmodal_overlay">
      <div className="appmodal_content">
        {/* Botón cerrar */}
        <button className="appmodal_close" onClick={onClose}>
          ×
        </button>

        <div className="appmodal_icon">
          <span role="img" aria-label="camera"><br/><br/>
PINCH

          </span>
        </div>

        <h2 className="appmodal_title">Welcome to PINCH Job Tracker!</h2>
        <p className="appmodal_text">
          Submitting your photos is key to ensuring service quality and releasing your final payment.
        </p>

        <ol className="appmodal_list">
          <li>First, review the job details and <b>share your location</b> before starting.</li>
          <br/>
          <li>Then, click Start Job to begin.</li>
        </ol>

        <p className="appmodal_text">
          We’re glad to have you on board—let’s get the job done right!
        </p>

 <hr className="spaceAlt" />
        <div className="appmodal_footer">
          
          <label className="appmodal_checkbox">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            /> Don't show this again
          </label>
          <button className="appmodal_ok"  onClick={handleOk}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppModal1;
