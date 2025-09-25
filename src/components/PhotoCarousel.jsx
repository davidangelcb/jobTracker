// PhotoCarousel.jsx
import React, { useState, useEffect } from "react";
import "./PhotoCarousel.css";

const PhotoCarousel = ({ photos, activeIndex, setActiveIndex, onRemovePhoto,  handleUpdateCommentFunction , mainstartJobData }) => {
   

 let activeBtn = true;
 if(mainstartJobData?.isConfirmed){
    activeBtn=false;

 }

  useEffect(() => {
    console.log(11);
  if (!photos || photos.length === 0) {
    setActiveIndex(null);
  } else if (activeIndex >= photos.length) {
    setActiveIndex(0);
  }
  console.log(11111);
}, [photos]);



  if (!photos || photos.length === 0) return null;
   

  return (
    <div className="carousel-container">
      {/* Carrusel de miniaturas */}
      <div className="carousel-scroll">
        {photos.map((item, idx) => (
          <div key={item.id}   className='photo-card'
                      onClick={() => setActiveIndex(idx)}
          >
           {activeBtn && (
          <button
            className="photo-remove-btn"
            onClick={(e) => {
              
                onRemovePhoto(item.id);
              }}
          >
            ×
          </button>
          )}
          <img
            key={idx}
            src={item.photo}
            alt={`preview-${idx}`}
            className={`carousel-thumb ${
              idx === activeIndex ? "active" : ""
            }`}
             
          />
          </div>
        ))}
      </div>

      {/* Comentario de la imagen activa */}
      
      <div className="titlePhoto">Photo {activeIndex+1}</div>
      <div  className="carousel-comment" >
         <textarea
            value={photos[activeIndex]?.comment}
            onChange={(e) => handleUpdateCommentFunction(e.target.value)}
            placeholder="Add comment..."
           
          />
      </div>
    </div>
    
  );
};

export default PhotoCarousel;
