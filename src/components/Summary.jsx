
import React, { useMemo, useEffect } from "react";
import "./Summary.css";

/**
 Props esperados:
  - beforeFotos: array de arrays [[{ photo, comment, blob }, ...], [...]]
  - afterFotos:  array de arrays
  - date, time: strings
*/
const Summary = ({ mainstartJobData = [], mainendJobData = []   }) => {
  let beforeFotos = mainstartJobData.photos;
  let afterFotos = mainendJobData.photos;
  let date = "21/21/22";
  let time = "10:10am";

  // aplanar los arrays
  const flatBefore = useMemo(() => (Array.isArray(beforeFotos) ? beforeFotos.flat() : []), [beforeFotos]);
  const flatAfter = useMemo(() => (Array.isArray(afterFotos) ? afterFotos.flat() : []), [afterFotos]);

  // crear objectURLs para mostrar previews a partir de blob (si existe), o usar photo (dataURL) si no
  const beforeWithUrls = useMemo(() => {
    return flatBefore.map((item) => {
      const url = item?.blob ? URL.createObjectURL(item.blob) : item?.photo || "";
      return { ...item, _previewUrl: url };
    });
  }, [flatBefore]);

  const afterWithUrls = useMemo(() => {
    return flatAfter.map((item) => {
      const url = item?.blob ? URL.createObjectURL(item.blob) : item?.photo || "";
      return { ...item, _previewUrl: url };
    });
  }, [flatAfter]);

  // cleanup: revoke objectURLs cuando el componente se desmonte o cuando cambien los arrays
  useEffect(() => {
    return () => {
      beforeWithUrls.forEach((i) => { if (i._previewUrl && i.blob) URL.revokeObjectURL(i._previewUrl); });
      afterWithUrls.forEach((i) => { if (i._previewUrl && i.blob) URL.revokeObjectURL(i._previewUrl); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforeWithUrls, afterWithUrls]);

  const renderCarousel = (title, items = []) => (
    <div className="section">
      <h2 className="section-title">{title}</h2>

      <div className="carousel-container" role="list">
        <div className="carousel" role="listbox">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div key={idx} className="photo-card" role="option" aria-label={`photo-${idx}`}>
                <img src={item._previewUrl} alt={item.comment || `photo-${idx}`} className="photo" />
                <div className="photo-footer">{item.comment || date}</div>
              </div>
            ))
          ) : (
            <div className="no-photos">No photos available</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="summary">
      <h1 className="summary-title">Job Completed on:</h1>
      <p className="summary-subtitle">{date} at {time}</p>

      {renderCarousel("Before Photos", beforeWithUrls)}
      {renderCarousel("After Photos", afterWithUrls)}

      <div className="info-box">
        <div className="info-icon">ℹ️</div>
        <div className="info-text">
          We successfully received your before and after photos. If you need to make any changes, please contact us.
          <br /><br />
          Text Only: <a href="sms:8439831466" className="link">843-983-1466</a><br />
          Email: <a href="mailto:Ops@pinchjob.com" className="link">Ops@pinchjob.com</a>
        </div>
      </div>
    </div>
  );
};

export default Summary;
