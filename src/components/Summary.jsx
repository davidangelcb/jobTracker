import React from "react";
import "./Summary.css";

const Summary = ({ mainstartJobData = [], mainendJobData = [] }) => {
  // aplanamos para un solo carrusel
 let beforeFotos = mainstartJobData.photos;
 let afterFotos = mainendJobData.photos;
 let date = "21/21/22";
 let time = "10:10am";

  const flatBefore = beforeFotos.flat();
  const flatAfter = afterFotos.flat();

  const renderCarousel = (title, fotos = []) => (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      <div className="carousel">
        {fotos.length > 0 ? (
          fotos.map((item, index) => (
            <div key={index} className="photo-card">
              <img
                src={URL.createObjectURL(item.blob)}
                alt={item.comment}
                className="photo"
              />
              <div className="photo-footer">{item.comment}</div>
            </div>
          ))
        ) : (
          <p className="no-photos">No photos available</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="summary">
      <h1 className="summary-title">Job Completed on:</h1>
      <p>
        {date} at {time}
      </p>

      {renderCarousel("Before Photos", flatBefore)}
      {renderCarousel("After Photos", flatAfter)}

      <div className="info-box">
        <p>
          We successfully received your before and after photos. If you need to
          make any changes, please contact us
        </p>
        <p>
          Text Only: <a href="tel:8439831466">843-983-1466</a>
          <br />
          Email: <a href="mailto:Ops@pinchjob.com">Ops@pinchjob.com</a>
        </p>
      </div>
    </div>
  );
};

export default Summary;
