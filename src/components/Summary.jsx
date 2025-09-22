import React from "react";
import "./Summary.css"; // estilos separados

const Summary = ({ beforeFotos, afterFotos, date, time }) => {
  const renderSection = (title, fotos) => (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      <div className="rows">
        {fotos.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((item, index) => (
              <div key={index} className="photo-card">
                <img
                  src={URL.createObjectURL(item.blob)}
                  alt={item.comment}
                  className="photo"
                />
                <div className="photo-footer">{date}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="summary-container">
      {/* Header */}
      <h1 className="header-title">Job Completed on:</h1>
      <p className="header-subtitle">
        {date} at {time}
      </p>

      {/* Before Photos */}
      {renderSection("Before Photos", beforeFotos)}

      {/* After Photos */}
      {renderSection("After Photos", afterFotos)}

      {/* Info box */}
      <div className="info-box">
        <div className="info-icon">ℹ️</div>
        <div className="info-text">
          We successfully received your before and after photos. If you need to
          make any changes, please contact us
          <br />
          <br />
          <span>
            Text Only:{" "}
            <a href="sms:8439831466" className="link">
              843-983-1466
            </a>
          </span>
          <br />
          <span>
            Email:{" "}
            <a href="mailto:Ops@pinchjob.com" className="link">
              Ops@pinchjob.com
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Summary;
