// PhotoOverlay.jsx
import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./PhotoOverlay.css";

export default function PhotoOverlay({ onClose, onSave }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // guardamos el stream aquí
  const [captured, setCaptured] = useState(null);
  const [comment, setComment] = useState("");
  const [blob, setBlob] = useState(null);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (!mounted) {
          // si ya se desmontó, detenemos inmediatamente
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          // intenta forzar reproducción (algunos navegadores devuelven promise)
          const p = videoRef.current.play();
          if (p && p.catch) p.catch(() => {});
        }
      } catch (err) {
        console.error("No se pudo acceder a la cámara:", err);
        // opcional: notificar al usuario o cerrar overlay
      }
    };

    startCamera();

    return () => {
      mounted = false;
      // detener stream al desmontar
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []); // ejecutar una vez al montar

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = canvasRef.current || document.createElement("canvas");
    // dimensionar canvas a la resolución real del video
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCaptured(dataUrl);
 // Blob (para S3)
    canvas.toBlob(
      (b) => {
        setBlob(b);
      },
      "image/jpeg",
      0.9
    );

  };

  const handleSave = () => {
    if (!captured || !blob) return;

    // detener cámara antes de salir
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    // enviamos (dataUrl, comment)
    onSave && onSave(captured, comment, blob);
    onClose && onClose();
  };

  const handleRetake = () => {
    // simplemente descartamos la captura; la cámara sigue activa
    setCaptured(null);
    setComment("");
    setBlob(null);
    // volvemos a intentar reproducir video por si se pausó
    if (videoRef.current) {
      const p = videoRef.current.play();
      if (p && p.catch) p.catch(() => {});
    }
  };

  const handleCancel = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    onClose && onClose();
  };

  const overlay = (
    <div className="photo-overlay">
      <div className="overlay-panel">
        {!captured ? (
          <>
            <div className="video-wrap">
              <video
                ref={videoRef}
                className="camera-video"
                autoPlay
                playsInline
                muted
              />
            </div>

            <div className="overlay-controls">
              <button className="camera-btn capture" onClick={handleCapture}>
             Capture
              </button>
              <button className="camera-btn cancel" onClick={handleCancel}>
                 Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="preview-area">
            <div className="close">  
              <div className="close-x" onClick={handleCancel}>X</div>
            </div> 
            <img className="preview-img" src={captured} alt="preview" />
            <textarea
              className="preview-text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="preview-actions">
             
              <button className="save-btn" onClick={handleSave}>
                 Save
              </button>
                 
            </div>
            
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );

  // render en body para evitar problemas de stacking / z-index
  return createPortal(overlay, document.body);
}
