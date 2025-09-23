// Summary.jsx
import React, { useMemo, useEffect, useState } from "react";
import "./Summary.css";

const Summary = ({ mainstartJobData = [], mainendJobData = [] }) => {
  const [activePhoto, setActivePhoto] = useState(null);

  let beforeFotos = mainstartJobData.photos;
  let afterFotos = mainendJobData.photos;
  let date = "21/21/22";
  let time = "10:10am";

  const flatBefore = useMemo(
    () => (Array.isArray(beforeFotos) ? beforeFotos.flat() : []),
    [beforeFotos]
  );
  const flatAfter = useMemo(
    () => (Array.isArray(afterFotos) ? afterFotos.flat() : []),
    [afterFotos]
  );

  const beforeWithUrls = useMemo(
    () =>
      flatBefore.map((item) => {
        const url = item?.blob
          ? URL.createObjectURL(item.blob)
          : item?.photo || "";
        return { ...item, _previewUrl: url };
      }),
    [flatBefore]
  );

  const afterWithUrls = useMemo(
    () =>
      flatAfter.map((item) => {
        const url = item?.blob
          ? URL.createObjectURL(item.blob)
          : item?.photo || "";
        return { ...item, _previewUrl: url };
      }),
    [flatAfter]
  );

  useEffect(() => {
    return () => {
      beforeWithUrls.forEach((i) => {
        if (i._previewUrl && i.blob) URL.revokeObjectURL(i._previewUrl);
      });
      afterWithUrls.forEach((i) => {
        if (i._previewUrl && i.blob) URL.revokeObjectURL(i._previewUrl);
      });
    };
  }, [beforeWithUrls, afterWithUrls]);

  const renderCarousel = (title, items = []) => (
    <div className="summary_section">
      <h2 className="summary_section-title">{title}</h2>
      <div className="summary_carousel-wrapper">
        <div className="summary_carousel">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div
                key={idx}
                className="summary_photo-card"
                onClick={() => setActivePhoto(item)} // <-- abrir overlay
              >
                <img
                  src={item._previewUrl}
                  alt={item.comment || `photo-${idx}`}
                  className="summary_photo"
                />
                <div className="summary_photo-footer">
                  {item.comment || date}
                </div>
              </div>
            ))
          ) : (
            <div className="summary_no-photos">No photos available</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="summary">
      <h1 className="summary_title">Job Completed on:</h1>
      <p className="summary_subtitle">
        {date} at {time}
      </p>
      <hr className="spaceAlt" />
      {renderCarousel("Before Photos", beforeWithUrls)}
      {renderCarousel("After Photos", afterWithUrls)}

      <div className="summary_info-box">
        <div className="summary_info-icon">
          <svg
            width="26"
            height="25"
            viewBox="0 0 26 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 25C19.875 25 25.5 19.375 25.5 12.5C25.5 5.625 19.875 -2.3991e-06 13 -3.00013e-06C6.125 -3.60117e-06 0.5 5.625 0.499999 12.5C0.499999 19.375 6.125 25 13 25ZM13 6.25C13.75 6.25 14.25 6.75 14.25 7.5C14.25 8.25 13.75 8.75 13 8.75C12.25 8.75 11.75 8.25 11.75 7.5C11.75 6.75 12.25 6.25 13 6.25ZM11.75 12.5C11.75 11.75 12.25 11.25 13 11.25C13.75 11.25 14.25 11.75 14.25 12.5L14.25 17.5C14.25 18.25 13.75 18.75 13 18.75C12.25 18.75 11.75 18.25 11.75 17.5L11.75 12.5Z"
              fill="#241D5D"
            />
          </svg>
        </div>
        <div className="summary_info-text">
          We successfully received your before and after photos. If you need to
          make any changes, please contact us.
          <br />
          <br />
          Text Only:{" "}
          <a href="sms:8439831466" className="summary_link">
            843-983-1466
          </a>
          <br />
          Email:{" "}
          <a href="mailto:Ops@pinchjob.com" className="summary_link">
            Ops@pinchjob.com
          </a>
        </div>
      </div>

      {activePhoto && (
  <div className="summary_overlay" onClick={() => setActivePhoto(null)}>
    <div
      className="summary_overlay-content"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Botón cerrar */}
      <button
        className="summary_overlay-close"
        onClick={() => setActivePhoto(null)}
      >
        ✖
      </button>

      <div className="summary_overlay-img-wrapper">
        {/* Fecha superpuesta */}
        <div className="summary_overlay-date">
          Thursday, 8th, 2025 - 14:25 PM
        </div>

        {/* Imagen */}
        <img
          src={activePhoto._previewUrl}
          alt={activePhoto.comment}
          className="summary_overlay-img"
        />
      </div>

      {/* Título + comentario */}
      <div className="summary_overlay-text">
        <div className="summary_overlay-title">
          {activePhoto.title || "Bath"}
        </div>
        <div className="summary_overlay-comment">
          {activePhoto.comment || "No description available"}
        </div>
      </div>
    </div>
  </div>
)}



      
    </div>
  );
};

export default Summary;
