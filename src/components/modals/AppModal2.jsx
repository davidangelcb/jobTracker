import { useEffect, useState } from "react";
import "./AppModal.css";

function AppModal2({ show, onClose, onDontShowAgain  }) {
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
          <span role="img" aria-label="camera">

            <svg width="69" height="69" viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="34.5" cy="34.5" r="34.5" fill="#EDF7FF"/>
<path d="M50.6918 24.4022H46.6832C45.2383 24.3954 43.9633 23.4615 43.5257 22.0899L42.6471 19.3123C42.2216 17.932 40.938 16.993 39.4897 16.9999H30.539C29.0924 16.9965 27.8105 17.9355 27.3815 19.3123L26.5029 22.0899C26.0653 23.4615 24.7904 24.3954 23.3455 24.4022H19.3094C17.4819 24.4039 16.0027 25.8782 16.001 27.6997V46.9513C16.0027 48.7729 17.4819 50.2471 19.3094 50.2488H50.692C52.5196 50.2471 53.9987 48.7728 54.0004 46.9513V27.6997C53.9987 25.8782 52.5193 24.4039 50.6918 24.4022ZM35.0282 46.4451C32.1744 46.4468 29.4372 45.318 27.4195 43.3083C25.3998 41.2987 24.2655 38.5708 24.2655 35.7266C24.2655 32.8823 25.398 30.1559 27.4161 28.1449C29.4341 26.1339 32.1693 25.0047 35.023 25.0047C37.8767 25.0047 40.6139 26.1352 42.6299 28.1483C44.6462 30.1597 45.7788 32.8875 45.777 35.7318C45.7719 38.5726 44.6393 41.2937 42.623 43.3017C40.6084 45.3113 37.8783 46.44 35.0282 46.4451Z" fill="#0088FF"/>
<path d="M41.3459 41.6992C41.2273 41.6992 41.1382 41.6402 41.0789 41.5518C38.5271 37.014 34.9073 37.014 33.9578 37.1022V39.0176C33.9578 39.1354 33.8984 39.2238 33.7798 39.2828C33.6907 39.3417 33.5424 39.3122 33.4534 39.2533L27.5191 34.5679C27.4301 34.509 27.4004 34.4206 27.4004 34.3322C27.4004 34.2438 27.4301 34.1554 27.5191 34.0965L33.483 29.4111C33.572 29.3522 33.6907 29.3227 33.8094 29.3817C33.8984 29.4406 33.9874 29.529 33.9874 29.6469V31.5328C36.183 31.5917 37.9337 32.3284 39.2392 33.6838C41.9095 36.5715 41.6425 41.2274 41.6425 41.4043C41.6425 41.5222 41.5535 41.6401 41.4052 41.6695C41.3755 41.699 41.3458 41.699 41.3458 41.699L41.3459 41.6992Z" fill="#0088FF"/>
</svg>

          </span>
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

export default AppModal2;
