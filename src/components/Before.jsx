import React, { useState } from "react";
//import StepContent from "./StepContent";
import AccordionStep from "./AccordionStep";
import "./Before.css";

const items = [
  "Front Door (Unit Number)",
  "Kitchen - Appliances (Door Open)",
  "Living Room Ceiling Fan(s)",
  "Bedrooms",
  "Bathrooms",
  "Others (Not Required)"
];
/*
 mainstartJobData = {startJobData} 
                mainSetStartJobData = {setStartJobData}
*/
function verifyCompletedInformation(arrayData){
    let completed =  true;
    for (let i = 0; i < arrayData.length-1; i++) {
        if(arrayData[i].length==0){
            completed = false;
            break;
        }
    }
    return completed;
}
const Before = ({mainstartJobData, mainSetStartJobData}) => {

 let activeBtn = true;
 let defaultCompleted = [];
 if(mainstartJobData.isConfirmed){
    defaultCompleted = [0,1,2,3,4,5]
    activeBtn=false;

 }

  const [openIndices, setOpenIndices] = useState([0]);  
  const [openIndex, setOpenIndex] = useState(0);
  const [completed, setCompleted] = useState(defaultCompleted);
  const [stepsData, setStepsData] = useState(mainstartJobData.photos);

  const handleComplete = (index, newData) => {
  const updated = [...stepsData];
  updated[index] = newData;
  setStepsData(updated);

  if (!completed.includes(index)) {
    setCompleted([...completed, index]);
    // desbloquear el siguiente paso sin abrirlo
    // No modificar openIndices aquí
  }
  console.log("Estado actual de stepsData:", updated);
  setInformacion(updated);
  //aca le pasmos el udate
  //mainSetStartJobData
};

const setInformacion = (updated) => {
     mainSetStartJobData((prev) => ({
      ...prev,
      photos: updated,
      activeFoot: verifyCompletedInformation(updated)
    }));
}

let iconAcc1 = `
<svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.96645 7.83267L16.8164 0.975337C17.0674 0.748322 17.0602 0.386571 16.8003 0.167323C16.5468 -0.0465668 16.1449 -0.0465669 15.8914 0.167323L8.50396 6.62065L1.11652 0.167318C0.861088 -0.0557798 0.446972 -0.0557799 0.191542 0.167318C-0.0638485 0.390483 -0.0638485 0.7522 0.191542 0.975332L8.04147 7.83267C8.29694 8.05577 8.71102 8.05577 8.96645 7.83267Z" fill="#8C8C8C"/>
</svg>`;

  return (
    <div className="body-container">
      <h2 className="body-title">Before Photos</h2>
      <div className="timeline">
        {items.map((item, index) => {
          //const isActive = index === openIndex;
          //const isActive = openIndices.includes(index);
          const isActive = index === openIndex;
          const isCompleted = completed.includes(index);
          //const isLocked = index > openIndex;
          //const isLocked = !completed.includes(index - 1) && index !== 0; 
            const isLocked = index !== 0 && !completed.includes(index - 1);


          return (
            <div key={index} className="accordion-item">
              <div
                className={`timeline-dot ${
                  isCompleted || isActive ? "active" : "inactive"
                }`}
              ></div>

              <div
                className={`accordion-header ${
                  isLocked ? "disabled" : isActive ? "active" : ""
                }`}
                //onClick={() => !isLocked && setOpenIndex(index)}
                onClick={() => {
                if (isLocked) return;

                setOpenIndex((prev) => (prev === index ? null : index));
                }}
              >
                <span>{item}</span>
                <span className="arrow">{isActive ? "^" : "˅"}</span>
              </div>

              {isActive && (
                <div className="accordion-content">
                  
                   <AccordionStep
                       stepIndex={index}
                       data={stepsData[index]}
                       onComplete={(data) => handleComplete(index, data)}
                       activeBtnMain={activeBtn}
                   />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div><br/><br/><br/><br/><br/><br/><br/></div>
    </div>
  );
};

export default Before;