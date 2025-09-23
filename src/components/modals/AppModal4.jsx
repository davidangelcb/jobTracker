import { useEffect, useState } from "react";
import "./AppModal.css";

function AppModal3({ show, onClose, MainJobInfoData  }) {
  const [checked, setChecked] = useState(false);

  if (!show) return null;
 
  return (
    <div className="appmodal_overlay">
      <div className="appmodal_content">
        {/* Botón cerrar */}
         

        <div className="appmodal_icon"><br/>
          <span role="img" aria-label="camera">

<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="30" cy="30" r="30" fill="#E4F0FF"/>
<path d="M30.0002 12.7383C20.5061 12.7383 12.7383 20.5061 12.7383 30.0002C12.7383 39.4942 20.5061 47.2621 30.0002 47.2621C39.4942 47.2621 47.2621 39.4942 47.2621 30.0002C47.2621 20.5061 39.4942 12.7383 30.0002 12.7383ZM37.2502 27.0657L28.9645 35.3514C28.274 36.0419 27.2383 36.0419 26.5478 35.3514L22.7502 31.5538C22.0597 30.8633 22.0597 29.8276 22.7502 29.1371C23.4407 28.4466 24.4764 28.4466 25.1669 29.1371L27.7561 31.7264L34.8335 24.649C35.524 23.9585 36.5597 23.9585 37.2502 24.649C37.9407 25.3395 37.9407 26.3752 37.2502 27.0657Z" fill="#0088FF"/>
</svg>


          </span>
        </div>

        <h2 className="appmodal_title">Job Completed!</h2>
        <p className="appmodal_text">
          Thank you for completing the cleaning service at 
           &nbsp;<b>{MainJobInfoData.name} {MainJobInfoData.unit} </b> 
        </p>

        <p className="appmodal_text">
          Before and after photos have been submitted. No further action is needed.
        </p>
 
        <div className="center">
          
          <button className="footer-btn"  onClick={onClose} >Close</button> 
        </div>
      </div>
    </div>
  );
}

export default AppModal3;
