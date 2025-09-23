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
          <span role="img" aria-label="camera">

<svg width="69" height="69" viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="34.5" cy="34.5" r="34.5" fill="#EDF7FF"/>
<path d="M50.6918 24.4022H46.6832C45.2383 24.3954 43.9633 23.4615 43.5257 22.0899L42.6471 19.3123C42.2216 17.932 40.938 16.993 39.4897 16.9999H30.539C29.0924 16.9965 27.8105 17.9355 27.3815 19.3123L26.5029 22.0899C26.0653 23.4615 24.7904 24.3954 23.3455 24.4022H19.3094C17.4819 24.4039 16.0027 25.8782 16.001 27.6997V46.9513C16.0027 48.7729 17.4819 50.2471 19.3094 50.2488H50.692C52.5196 50.2471 53.9987 48.7728 54.0004 46.9513V27.6997C53.9987 25.8782 52.5193 24.4039 50.6918 24.4022ZM35.0282 46.4451C32.1744 46.4468 29.4372 45.318 27.4195 43.3083C25.3998 41.2987 24.2655 38.5708 24.2655 35.7266C24.2655 32.8823 25.398 30.1559 27.4161 28.1449C29.4341 26.1339 32.1693 25.0047 35.023 25.0047C37.8767 25.0047 40.6139 26.1352 42.6299 28.1483C44.6462 30.1597 45.7788 32.8875 45.777 35.7318C45.7719 38.5726 44.6393 41.2937 42.623 43.3017C40.6084 45.3113 37.8783 46.44 35.0282 46.4451Z" fill="#0088FF"/>
<path d="M28.3413 41C28.4746 41 28.5746 40.938 28.6412 40.8449C31.5065 36.0681 35.571 36.0681 36.6371 36.161V38.1772C36.6371 38.3012 36.7037 38.3943 36.837 38.4563C36.9369 38.5184 37.1035 38.4873 37.2035 38.4253L43.8667 33.4932C43.9667 33.4312 44 33.3381 44 33.2451C44 33.152 43.9667 33.059 43.8667 32.9969L37.1702 28.0648C37.0703 28.0028 36.937 27.9718 36.8037 28.0338C36.7038 28.0959 36.6038 28.1889 36.6038 28.313V30.2982C34.1385 30.3602 32.1728 31.1357 30.7069 32.5625C27.7085 35.6023 28.0083 40.5034 28.0083 40.6896C28.0083 40.8137 28.1083 40.9378 28.2749 40.9688C28.3082 40.9998 28.3415 40.9998 28.3415 40.9998L28.3413 41Z" fill="#0088FF"/>
</svg>

          </span>
        </div>

        <h2 className="appmodal_title">Submit After Photos</h2>
        <p className="appmodal_text">
          Please take the required photos:  Kitchen, Bedrooms, Bathrooms, and Living Room to complete the job.
        </p>

        <ol className="appmodal_list">
          <li>Capture photos of each space (you may add extras if needed)</li>
          <li>Click Submit After Photos to continue.</li>
        </ol>
 <hr className="spaceAlt" />
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
