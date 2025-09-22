// PhotoCarousel.jsx
import React, { useState } from "react";
import "./PhotoCarousel.css";

const PhotoCarousel = ({ photos }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="carousel-container">
      {/* Carrusel de miniaturas */}
      <div className="carousel-scroll">
        {photos.map((item, idx) => (
          <img
            key={idx}
            src={item.photo}
            alt={`preview-${idx}`}
            className={`carousel-thumb ${
              idx === activeIndex ? "active" : ""
            }`}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>

      {/* Comentario de la imagen activa */}
      <div className="titlePhoto">Photo {activeIndex+1}</div>
      <div className="carousel-comment">
        <p>{photos[activeIndex].comment || "No comment"}</p>
      </div>
    </div>
  );
};

export default PhotoCarousel;
