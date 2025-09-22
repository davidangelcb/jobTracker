 

// Summary.jsx
import React, { useMemo, useEffect } from "react";
import "./Summary.css";

const Summary = ({ mainstartJobData = [], mainendJobData = [] }) => {
  let beforeFotos = mainstartJobData.photos;
  let afterFotos = mainendJobData.photos;
  let date = "21/21/22";
  let time = "10:10am";

  const flatBefore = useMemo(() => (Array.isArray(beforeFotos) ? beforeFotos.flat() : []), [beforeFotos]);
  const flatAfter = useMemo(() => (Array.isArray(afterFotos) ? afterFotos.flat() : []), [afterFotos]);

  const beforeWithUrls = useMemo(() =>
    flatBefore.map((item) => {
      const url = item?.blob ? URL.createObjectURL(item.blob) : item?.photo || "";
      return { ...item, _previewUrl: url };
    }), [flatBefore]
  );

  const afterWithUrls = useMemo(() =>
    flatAfter.map((item) => {
      const url = item?.blob ? URL.createObjectURL(item.blob) : item?.photo || "";
      return { ...item, _previewUrl: url };
    }), [flatAfter]
  );

  useEffect(() => {
    return () => {
      beforeWithUrls.forEach((i) => { if (i._previewUrl && i.blob) URL.revokeObjectURL(i._previewUrl); });
      afterWithUrls.forEach((i) => { if (i._previewUrl && i.blob) URL.revokeObjectURL(i._previewUrl); });
    };
  }, [beforeWithUrls, afterWithUrls]);

  const renderCarousel = (title, items = []) => (
    <div className="summary_section">
      <h2 className="summary_section-title">{title}</h2>
      <div className="summary_carousel-wrapper">
        <div className="summary_carousel">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div key={idx} className="summary_photo-card">
                <img src={item._previewUrl} alt={item.comment || `photo-${idx}`} className="summary_photo" />
                <div className="summary_photo-footer">{item.comment || date}</div>
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
      <p className="summary_subtitle">{date} at {time}</p>
      {renderCarousel("Before Photos", beforeWithUrls)}
      {renderCarousel("After Photos", afterWithUrls)}

      <div className="summary_info-box">
        <div className="summary_info-icon">ℹ️</div>
        <div className="summary_info-text">
          We successfully received your before and after photos. If you need to make any changes, please contact us.
          <br /><br />
          Text Only: <a href="sms:8439831466" className="summary_link">843-983-1466</a><br />
          Email: <a href="mailto:Ops@pinchjob.com" className="summary_link">Ops@pinchjob.com</a>
        </div>
      </div>
    </div>
  );
};

export default Summary;
