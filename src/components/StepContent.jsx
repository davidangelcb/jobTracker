// StepContent.js
import React, { useState } from "react";
import PhotoOverlay from "./PhotoOverlay";
import PhotoCarousel from "./PhotoCarousel";

const StepContent = ({ stepIndex, data, onComplete }) => {
  const [photos, setPhotos] = useState(data || []);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSavePhoto = (photo, comment) => {
    const updated = [...photos, { photo, comment }];
    setPhotos(updated);
    onComplete(updated); // notificar a Before
    setShowOverlay(false);
  };

  return (
    <div>
      {showOverlay && (
        <PhotoOverlay
          onClose={() => setShowOverlay(false)}
          onSave={handleSavePhoto}
        />
      )}

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button onClick={() => setShowOverlay(true)}>📷 Take Photo</button>
        <button>🎥 Record Video</button>
      </div>

      {photos.length > 0 && (
        <PhotoCarousel photos={photos} />
      )}
    </div>
  );
};

export default StepContent;
