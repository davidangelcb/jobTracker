import React, { useState, useEffect, useRef } from "react";

export default function StartJob({ data, setData, startJobConfirmed }) {
  const [showCamera, setShowCamera] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [comment, setComment] = useState("");

  const photos = data.photos;

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [canConfirm, setCanConfirm] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  /* VIDEOS */

  // Estado para múltiples videos con comentarios
  const videos = data.videos;

  // Estado para overlay de grabación
  const [videoStream, setVideoStream] = useState(null);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
 
  const [currentPreviewVideo, setCurrentPreviewVideo] = useState({
    url: '',
    comment: '',
    poster: '',
    ready: false,
  });

  const [showPreviewOverlay, setShowPreviewOverlay] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const mediaRecorderRef = useRef(null);

  const handleSaveVideo = () => {
    if (currentPreviewVideo) {
      setData({
        ...data,
        videos: [
          ...videos,
          {
            url: currentPreviewVideo.url,
            comment: currentPreviewVideo.comment || "",
          },
        ],
      });

      setCurrentPreviewVideo(null);
      setRecordedChunks([]);
      setIsRecording(false);
      setShowPreviewOverlay(false);
      setShowVideoOverlay(false);
    }
  };

  useEffect(() => {
    if (showCamera) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error al acceder a la cámara:", err);
          setShowCamera(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [showCamera]);

  useEffect(() => {
    let option  = 0;
    if(data!==undefined){
       option =  data.option;
     }

    if (photos.length >= 5 && !canConfirm && option === 1) {
      console.log(`Tienes ${photos.length} imágenes`);
      setCanConfirm(true);
    } else if (videos.length >= 1 && !canConfirm && option === 2) {
      console.log(`Tienes ${videos.length} videos`);
      setCanConfirm(true);
    } else if (photos.length < 5 && canConfirm && option === 1) {
      setCanConfirm(false);
    } else if (videos.length < 0 && canConfirm && option === 2) {
      setCanConfirm(false);
    }
  }, [photos, canConfirm, videos, data]);

  /* VIDEOS */
  useEffect(() => {
    if (showVideoOverlay) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" }, audio: true })
        .then((stream) => {
          setVideoStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("Error accediendo a la cámara:", err);
          alert(
            "No se pudo acceder a la cámara. Por favor, revisa los permisos."
          );
        });
    } else {
      // Limpieza si el overlay se cierra
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }
    }
  }, [showVideoOverlay]);
  /*CIERRO VIDEOS */

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setPreviewImage(dataUrl);
      setShowPreview(true);
    }
  };
  // aca debe agregaruno
  const handleSavePhoto = () => {
    setData({
      ...data,
      photos: [...photos, { image: previewImage, comment }],
    });

    setPreviewImage(null);
    setComment("");
    setShowPreview(false);
    setShowCamera(false);
    //aca seleccionar default
    
     
    setSelectedPhotoIndex(0);
   
  };

  const handleCancelPreview = () => {
    setPreviewImage(null);
    setComment("");
    setShowPreview(false);
    setShowCamera(false);
  };
  const handleCommentChange = (index, newComment) => {
    const updatedPhotos = [...data.photos];
    updatedPhotos[index].comment = newComment;

    // Guardar automáticamente en el estado del padre
    setData((prev) => ({
      ...prev,
      photos: updatedPhotos,
    }));
  };

  const getDate = () => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const date = now.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    const formatted = `${time}-${date}`;
    return formatted;
  };
  /* FUNCS VIDEOS */
  const handleVideoCommentChange = (index, newComment) => {
    const updatedPhotos = [...data.videos];
    updatedPhotos[index].comment = newComment;

    // Guardar automáticamente en el estado del padre
    setData((prev) => ({
      ...prev,
      videos: updatedPhotos,
    }));
  };

  const startRecording2 = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
  
    const stream = videoRef.current.srcObject;
    
    let mimeType = '';
  
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      mimeType = 'video/webm;codecs=vp9';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      mimeType = 'video/webm;codecs=vp8';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4'; // Safari
    } else {
      alert('Este navegador no soporta MediaRecorder para video.');
      return;
    }
  
    const recorder = new MediaRecorder(stream, { mimeType });
  
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
  
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(blob);
      setCurrentPreviewVideo({ url: videoUrl, comment: "" });
      setRecordedChunks([]);
      setShowPreviewOverlay(true);
      setShowVideoOverlay(false);
    };
  
    //setMediaRecorder(recorder); // Si usas estado para controlarlo
    recorder.start();
  };
  
  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    let mimeType = '';
  
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      mimeType = 'video/webm;codecs=vp9';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      mimeType = 'video/webm;codecs=vp8';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4'; // Safari
    } else {
      alert('Este navegador no soporta MediaRecorder para video.');
      return;
    }
  
 

    const stream = videoRef.current.srcObject;
    const recorder = new MediaRecorder(stream, { mimeType });

    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

  

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(blob);
    
      const videoEl = document.createElement("video");
      videoEl.src = videoUrl;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.preload = "auto";
    
      videoEl.addEventListener("loadeddata", () => {
        // Crear canvas y capturar el primer frame como imagen
        const canvas = document.createElement("canvas");
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
    
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        const posterDataUrl = canvas.toDataURL("image/jpeg");
    
        // Guardar video y poster como parte del estado
        setCurrentPreviewVideo({
          url: videoUrl,
          poster: posterDataUrl,
          comment: "",
          ready: true,
        });
    
        setRecordedChunks([]);
        setShowPreviewOverlay(true);
        setShowVideoOverlay(false);
      });
    
      videoEl.load();
    };
    
    
    
     

    recorder.start();
    setIsRecording(true);
    setRecordedChunks([]);
    mediaRecorderRef.current = recorder; //

    setTimeout(() => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }, 10000);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop(); //
    }

    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setIsRecording(false);
    setShowVideoOverlay(false);
    setShowPreviewOverlay(true);
  };

  const handleCloseVideoOverlay = () => {
    console.log(1.1, data.isConfirmed)
    console.log(2.21, canConfirm)
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setIsRecording(false);
    setShowVideoOverlay(false);
    setRecordedChunks([]); // por si grabaste algo antes

    console.log(1.2, data.isConfirmed)
    console.log(2.22, canConfirm)
  };

  const handleClosePhotoOverlay = () => {
    setShowCamera(false);
  }

  return (
    <section className="step">
      <div className="step-header">
        <h2>End Job</h2>

        {data.isConfirmed == false && (
          <button
            onClick={() => {
              setData({ ...data, isConfirmed: true, dateConfirm: getDate() });
              startJobConfirmed(); // se sigue ejecutando la función original
            }}
            disabled={!canConfirm}
            style={canConfirm ? styles.btnConfirm : styles.btnConfirm}
          >
            Confirm
          </button>
        )}

        {data.isConfirmed && (
          <div className="confirmed">
            <span>Confirmed</span>
            <br />
            <span className="reduce">{data.dateConfirm}</span>
          </div>
        )}
      </div>

      <div className="bodyContent"  >
        <hr style={{ margin: "16px 0" }} />
        {!showCamera && (
          <>
            {(photos.length === 0 && videos.length===0) && (
              <div style={styles.subTitleStep}>
                <strong>Have you finished?</strong>

                <br />To complete the job, take photos or video of all spaces completed.
              </div>
            )}

            {/* Previews START */}
            {photos.length > 0 && (
              <div style={{ marginTop: 20}}>
                <p style={{ fontSize: 13, padding: 5 }}>
                  Before Photos or Video
                </p>
                <div style={{ display: "flex", overflowX: "auto" }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ marginRight: 8 }}>
                      <img
                        src={p.image}
                        alt={`preview-${i}`}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedPhotoIndex(i)}
                      />
                    </div>
                  ))}
                </div>

                {/* Área para mostrar y editar comentario del preview seleccionado */}
                {selectedPhotoIndex !== null && (
                  <div style={{ marginTop: 12 }}>
                    <textarea
                      value={photos[selectedPhotoIndex]?.comment || ""}
                      onChange={(e) =>
                        handleCommentChange(selectedPhotoIndex, e.target.value)
                      }
                      readOnly={data.isConfirmed ? true : false}
                      placeholder="Edit comment..."
                      style={{
                        width: "100%",
                        padding: 6,
                        borderRadius: 6,
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Previews  END*/}
          </>
        )}

        {/* Overlay cámara */}
        {showCamera && !showPreview && (
           <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            zIndex: 9999,
            overflow: 'hidden',
          }}>
          
            {/* Botón Cerrar */}
            <button
              onClick={handleClosePhotoOverlay}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "transparent",
                border: "none",
                fontSize: 32,
                color: "#fff",
                cursor: "pointer",
                zIndex: 10000,
              }}
            >
              ✖
            </button>
          
            {/* Video en full screen */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
              }}
            ></video>
          
            {/* Canvas oculto */}
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          
            {/* Botón "Take Photo" centrado abajo */}
            <div style={{
              position: 'absolute',
              bottom: 120,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              zIndex: 10001,
            }}>
              <button style={styles.captureButton}
                onClick={handleTakePhoto}
              >
                Take Photo
              </button>
            </div>
          </div>
          
          
        )}

        {/* Overlay preview */}
        {showPreview && (
          <div style={styles.overlay}>
            <button onClick={handleCancelPreview} 
            style={{
                position: "absolute",
                top: 66,
                right: 16,
                background: "transparent",
                border: "none",
                fontSize: 24,
                color: "#fff",
                cursor: "pointer",
                zIndex: 10000,
              }}>
                ✖
              </button>
            <div style={styles.previewBox}>
              
              <img
                src={previewImage}
                alt="preview"
                style={styles.previewImage}
              />
              <textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={styles.commentBox}
              />
              <button style={styles.saveButton} onClick={handleSavePhoto}>
                Save
              </button>
            </div>
          </div>
        )}

        {/*VIDEO Start */}
       
        {/*** */}

        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {/* Miniaturas de videos con comentarios */}
          
          {videos.length>0 && (
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              marginTop: "1rem",
              paddingBottom: 12,
            }}
          > 
            {videos.map((video, index) => (
              <div
                key={index}
                style={{
                  minWidth: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  padding: 8,
                  borderRadius: 6,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                <video
                  src={video.url}
                  controls
                  style={{
                    width: "100%",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: 4,
                    backgroundColor: "#000",
                  }}
                />
                <textarea
                  placeholder="Edit comment"
                  value={video.comment}
                  onChange={(e) =>
                    handleVideoCommentChange(index, e.target.value)
                  }
                  readOnly={data.isConfirmed ? true : false}
                  style={{
                    width: "100%",
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                    resize: "none",
                    padding: 4,
                  }}
                />
              </div>
            ))}
          </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          {((data.option === 0 || data.option === 1) && !data.isConfirmed) && (
            <button
              style={
                data.isConfirmed
                  ? styles.takePhotosBtnOff
                  : styles.takePhotosBtn
              }
              onClick={() => {
                if (data.isConfirmed) {
                  console.log("ya no se puede hacer click");
                } else {
                  setShowCamera(true);
                  setData({ ...data, option: 1 });
                }
              }}
            >
              +Take Photos
            </button>
          )}
         &nbsp;&nbsp;          
          {((data.option === 0 || data.option === 2) && !data.isConfirmed )&& (
            <button
              style={
                data.isConfirmed
                  ? styles.takePhotosBtnOff
                  : styles.takePhotosBtn
              }
              onClick={() => {
                if (data.isConfirmed) {
                  console.log("ya no se puede hacer click");
                } else {
                  setShowVideoOverlay(true);
                  setData({ ...data, option: 2 });
                  console.log(2.1, data.isConfirmed)
                  console.log(2.11, canConfirm)
                }
              }}
            >
              +Video
            </button>
          )}
        </div>
        {/*VIDEO END*/}
        {/*BLUE TEXT */}
        {data.isConfirmed && (
        <div
              style={{
                backgroundColor: '#e6f0ff',
                color: '#333',
                fontSize: 14,
                padding: '12px 16px',
                borderRadius: 6,
                marginTop: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
                <span style={{ color: '#007aff', fontWeight: 'bold', fontSize: 18 }}>ℹ️</span>
                <span>
                The photos or videos were submitted successfully to document the space Before cleaning.
                </span>
              </div>
        )}

        {/*VIDEO Start */}
        {showPreviewOverlay && currentPreviewVideo && (
          <div style={styles.overlay}>
            <button
              onClick={() => {
                setCurrentPreviewVideo(null);
                setShowPreviewOverlay(false); // cancela grabación si aplica
              }}
              style={{
                position: "absolute",
                top: 66,
                right: 16,
                background: "transparent",
                border: "none",
                fontSize: 24,
                color: "#fff",
                cursor: "pointer",
                zIndex: 10000,
              }}
            >✖
            </button>
            <div style={styles.previewBox}>
            {currentPreviewVideo.ready && (
              <video
                style={styles.previewImage}
                src={currentPreviewVideo.url}
                controls
                autoPlay={false}
                preload="auto"
                playsInline
                poster={currentPreviewVideo.poster}
                 className="video-preview"
              />
            )} 
            

            <textarea
            style={styles.commentBox}
              value={currentPreviewVideo.comment}
              onChange={(e) =>
                setCurrentPreviewVideo({
                  ...currentPreviewVideo,
                  comment: e.target.value,
                })
              }
              placeholder="Add a comment..."
            />

            <button style={styles.saveButton} onClick={handleSaveVideo}>
              save
            </button>
            </div>
          </div>
        )}

        {showVideoOverlay && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          
            {/* Botón cerrar */}
            <button
              onClick={handleCloseVideoOverlay}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "transparent",
                border: "none",
                fontSize: 32,
                color: "#fff",
                cursor: "pointer",
                zIndex: 10000,
              }}
            >
              ✖
            </button>
          
            {/* Video */}
            <video
              ref={videoRef}
              style={{
                width: '100vw',
                height: '100vh',
                objectFit: 'cover', // Asegura que el video llene el contenedor
              }}
              playsInline
              muted
              autoPlay
            />
          
            {/* Controles */}
            <div style={{
              position: 'absolute',
              bottom: 120,
              display: 'flex',
              gap: 20,
              zIndex: 10001,
            }}>
              {!isRecording ? (
                <button onClick={startRecording} style={styles.captureButton}>
                  Record
                </button>
              ) : (
                <button onClick={stopRecording} style={styles.captureStop}>
                  Stop Video
                </button>
              )}
            </div>
          </div>
          
        )}
        {/*VIDEO End */}
      </div>
    </section>
  );
}

const styles = {
   
  takePhotosBtn1: {
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#007AFF",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    top: "-50px",
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  cameraBox: {
    position: "relative",
    width: "90%",
    maxWidth: 600,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "auto",
  },
  cameraControls: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  captureButton: {
    backgroundColor: "#007aff",
    color: "#fff",
    border: "none",
     
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    width: "130px"
  },
  captureStop: {
    width: "130px",
    backgroundColor: "red",
    color: "#fff",
    border: "none",
  
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
  },
  previewBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    maxWidth: 400,
    position: "relative",
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
  },
  commentBox: {
    width: "100%",
    minHeight: 60,
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
    marginBottom: 10,
  },
  saveButton: {
    border: "none",
     
    backgroundColor: "#007AFF",
    color: "#fff",
     borderRadius: 8,
    cursor: "pointer",
    fontSize:"14px",
     textAlign: "center",
     width: "120px",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    fontSize: 20,
    background: "transparent",
    color: "#000",
    border: "none",
    cursor: "pointer",
  },

  fields: {
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 4,
  },
  titleStep: {
    color: "#333",
    fontSize: 16,
  },
  subTitleStep: {
    color: "#333",
    fontSize: 12,
  },
  locationBox: {
    background: "#e6f0ff",
    color: "#007aff",
    padding: "2px 8px",
    fontSize: 12,
    borderRadius: 4,
    width: "fit-content",
    marginBottom: 16,
  },
  confirmBtn: {
    backgroundColor: "white",
    color: "#007aff",
    padding: "12px 0",
    border: "1px solid #007aff",
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },
  confirmBtnGray: {
    backgroundColor: "#C7C7CC",
    color: "#eee",
    padding: "12px 0",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
    borderRadius: 4,
  },
  takePhotosBtn: {
    width: "130px",
    backgroundColor: "white",
    color: "#007aff",
    border: "1px solid #007aff",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center"

  },
  takePhotosBtnOff: {
    width: "130px",
    backgroundColor: "white",
    color: "gray",
    border: "1px solid gray",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer" 
  },
};
