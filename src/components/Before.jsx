import React, { useState } from "react";
//import StepContent from "./StepContent";
import AccordionStep from "./AccordionStep";
import "./Before.css";

const items = [
  "Front Door (Unit Number)",
  "Kitchen - Appliances (Door Open)",
  "Living Room",
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

 // Dentro del componente Before

  const handleRemovePhoto = (stepIndex, id) => {
    const updated = [...stepsData];
  updated[stepIndex] = updated[stepIndex].filter((photo) => photo.id !== id);
    setStepsData(updated);

    // actualizar también en mainSetStartJobData
    setInformacion(updated);
  };


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
                       onRemovePhoto={(id) => handleRemovePhoto(index, id)} // 👈 nuevo
                       mainstartJobData={mainstartJobData}
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