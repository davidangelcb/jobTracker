import { useEffect, useState } from "react";
import "./HeaderPro.css";
import { FaShareAlt, FaLocationArrow, FaCamera, FaClipboardList } from "react-icons/fa";
import NavBar from "./NavBar";
 
 
function HeaderPro({mainSetCurrentStep, mainSetCurrentMenuActive, mainCurrentMenuActiveList }) {
   
  return (
    <header className="header">
      {/* Parte superior */}
      <div className="header-top">
        <div className="logo">PINCH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div className="tracking">
          Tracking <span className="tracking-id">#124578</span>
        </div>
        <button className="share-btn">
          <FaShareAlt /> Share
        </button>
      </div>

      {/* Parte inferior */}
      <div className="header-bottom">
        <div className="project-name">Riverhood Apartments.</div>
        <NavBar
            currentStep={mainSetCurrentStep}
            enabledSteps={mainCurrentMenuActiveList}
            onStepChange={mainSetCurrentMenuActive}
        />
      </div>
    </header>
  );
}

export default HeaderPro; 