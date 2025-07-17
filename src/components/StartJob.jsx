import React, { useState, useEffect, useRef } from "react";

export default function StartJob({ data, setData, startJobConfirmed, model }) {
  const [showCamera, setShowCamera] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewImageBlod, setPreviewImageBlod] = useState(null);
  const [comment, setComment] = useState("");

  const photos = data.photos;

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

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
    url: "",
    comment: "",
    poster: "",
    ready: false,
    block: null,
    type: ""
  });

  const [showPreviewOverlay, setShowPreviewOverlay] = useState(false);

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
            blob: currentPreviewVideo.blob,
            type: currentPreviewVideo.type
          },
        ],
      });

      setCurrentPreviewVideo(null);
      setRecordedChunks([]);
      setIsRecording(false);
      setShowPreviewOverlay(false);
      setShowVideoOverlay(false);

      setSelectedVideoIndex(0);
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
    let option = 0;
    if (data !== undefined) {
      option = data.option;
    }
    console.log("inrgeso cac");
    console.log(option);
    console.log(videos.length);
    console.log(canConfirm);
    if (photos.length >= 5 && !canConfirm && option === 1) {
      console.log(`Tienes ${photos.length} imágenes`);
      setCanConfirm(true);
    } else if (videos.length >= 1 && !canConfirm && option === 2) {
      console.log(`Tienes ${videos.length} videos`);
      setCanConfirm(true);
    } else if (photos.length < 5 && canConfirm && option === 1) {
      setCanConfirm(false);
      console.log(1111113);
    } else if (videos.length <= 0 && canConfirm && option === 2) {
      setCanConfirm(false);
      console.log(1111114);
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
  function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const byteString = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([arrayBuffer], { type: mime });
  }

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      const blod = dataURLtoBlob(dataUrl); 
      setPreviewImage(dataUrl);
      setPreviewImageBlod(blod);
      setShowPreview(true);
    }
  };
  // aca debe agregaruno
  const handleSavePhoto = () => {
    setData({
      ...data,
      photos: [...photos, { image: previewImage, blod:previewImageBlod,  comment }],
    });

    setPreviewImage(null);
    setPreviewImageBlod(null);
    setComment("");
    setShowPreview(false);
    setShowCamera(false);
    //aca seleccionar default

    setSelectedPhotoIndex(0);
  };

  const handleCancelPreview = () => {
    setPreviewImage(null);
    setPreviewImageBlod(null);
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

  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    let mimeType = "";

    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      mimeType = "video/webm;codecs=vp9";
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
      mimeType = "video/webm;codecs=vp8";
    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      mimeType = "video/webm";
    } else if (MediaRecorder.isTypeSupported("video/mp4")) {
      mimeType = "video/mp4"; // Safari
    } else {
      alert("Este navegador no soporta MediaRecorder para video.");
      return;
    }

    const stream = videoRef.current.srcObject;
    const recorder = new MediaRecorder(stream, { mimeType });
    console.log(mimeType);
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
          blob: blob,
          type: mimeType
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
    console.log(1.1, data.isConfirmed);
    console.log(2.21, canConfirm);
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setIsRecording(false);
    setShowVideoOverlay(false);
    setRecordedChunks([]); // por si grabaste algo antes

    console.log(1.2, data.isConfirmed);
    console.log(2.22, canConfirm);
  };

  const handleClosePhotoOverlay = () => {
    setShowCamera(false);
  };

  return (
    <section className="step">
      <div className="step-header">
        <h2> {model === 1 ? "Start Job" : "End Job"}</h2>

        {data.isConfirmed === false && (
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
            <div className="confirmedText">Confirmed</div>
            <div className="reduce">{data.dateConfirm}</div>
          </div>
        )}
      </div>

      <div className="bodyContent">
        <hr style={{ margin: "16px 0" }} />
        {!showCamera && (
          <>
            {photos.length === 0 && videos.length === 0 && (
              <div style={styles.subTitleStep}>
                {model === 1 ? (
                  <>
                    To start the job, take photos or video of all spaces to be
                    cleaned.
                    <br />A minimum of 5 photos or a 10 second video is required
                    to start this job.
                  </>
                ) : (
                  <>
                    <strong>Have you finished?</strong> <br />
                    To complete the job, take photos or video of all spaces
                    completed.
                  </>
                )}
              </div>
            )}

            {/* Previews START */}
            {photos.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 13, padding: 5 }}>
                  Before Photos or Video
                </p>
                <div style={{ display: "flex", overflowX: "auto" }}>
                  {photos.map((p, i) => (
                    <div
                      key={i}
                      style={{ marginRight: 8, position: "relative" }}
                    >
                      {!data.isConfirmed && (
                        <button
                          onClick={() => {
                            const updatedPhotos = photos.filter(
                              (_, index) => index !== i
                            );
                            setData({ ...data, photos: updatedPhotos });
                            if (selectedPhotoIndex === i)
                              setSelectedPhotoIndex(null);
                          }}
                          style={styles.closeButtonImgPreview}
                        >
                          x
                        </button>
                      )}
                      <img
                        src={p.image}
                        alt={`preview-${i}`}
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: "cover",
                          cursor: "pointer",
                          border:
                            selectedPhotoIndex === i
                              ? "3px solid #007Aff"
                              : "3px solid #fff",
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
                      style={styles.boxTextImgComment}
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
          <div
            style={styles.overlayTakePhoto}
          >
            {/* Botón Cerrar */}
            <button
              onClick={handleClosePhotoOverlay}
              style={styles.closeOverlayTakePhoto}
            >
              ✖
            </button>

            {/* Video en full screen */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100vw",
                height: "100vh",
                objectFit: "cover",
              }}
            ></video>

            {/* Canvas oculto */}
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

            {/* Botón "Take Photo" centrado abajo */}
            <div
              style={styles.containerButtonTakePhoto}
            >
              <button style={styles.captureButton} onClick={handleTakePhoto}>
                Take Photo
              </button>
            </div>
          </div>
        )}

        {/* Overlay preview */}
        {showPreview && (
          <div style={styles.overlay}>
            <button
              onClick={handleCancelPreview}
              style={styles.closeOverlayImgPreview}
            >
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

        <div>
          {/* Miniaturas de videos con comentarios */}

          {videos.length > 0 && (
            <div>
              <p style={{ fontSize: 13, padding: 5 }}>
                After Photos or Video
              </p>
              <div
                style={styles.panelVideoPreview}
              >
                {videos.map((video, index) => (
                  <div
                    key={index}
                    style={styles.containerVideoPreview}
                  >
                    {!data.isConfirmed && (
                      <button
                        onClick={() => setSelectedVideoIndex(index)}
                        style={styles.buttonCheckVideoPreview}
                      >
                        ✓
                      </button>
                    )}
                    {!data.isConfirmed && (
                      <button
                        onClick={() => {
                          const updated = videos.filter((_, i) => i !== index);
                          setData({ ...data, videos: updated });
                          if (updated.length > 0) {
                            setSelectedVideoIndex(0);
                          }
                        }}
                        style={styles.closeVideoPreview}
                      >
                        x
                      </button>
                    )}
                    <video
                      src={video.url}
                      controls
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        padding: 2,
                        backgroundColor:
                          selectedVideoIndex === index ? "  #007Aff" : "#fff",
                      }}
                    />
                  </div>
                ))}
              </div>
              {selectedVideoIndex !== null && (
                <div style={{ marginTop: 12 }}>
                  <textarea
                    value={videos[selectedVideoIndex]?.comment || ""}
                    onChange={(e) =>
                      handleVideoCommentChange(
                        selectedVideoIndex,
                        e.target.value
                      )
                    }
                    readOnly={data.isConfirmed ? true : false}
                    placeholder="Edit comment..."
                    style={styles.boxTextVideoPreview}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        { !data.isConfirmed && (
        <div style={styles.buttonPhotos}>
          {(data.option === 0 || data.option === 1) && !data.isConfirmed && (
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
              +Photos
            </button>
          )}
           
          {(data.option === 0 || data.option === 2) && !data.isConfirmed && (
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
                }
              }}
            >
              +Video
            </button>
          )}
        </div>
        )}
        {/*VIDEO END*/}
        {/*BLUE TEXT */}
        {data.isConfirmed && (
          <div   style={styles.informationContainer}>
            <span  style={styles.informationText} >
              ℹ️
            </span>
            <span>
              
              {data.option  === 1 ? (
                  <>
                    The photos or videos were submitted successfully to document the
                    space Before cleaning.
                  </>
                ) : (
                  <>
                    The photos or videos were submitted successfully to document the
                    space After cleaning.
                  </>
                )}
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
              style={styles.closeOverlayVideo}
            >
              ✖
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
          <div
            style={styles.overlayVideo}
          >
            {/* Botón cerrar */}
            <button
              onClick={handleCloseVideoOverlay}
              style={styles.closeVideoButton}
            >
              ✖
            </button>

            {/* Video */}
            <video
              ref={videoRef}
              style={styles.contentVideo}
              playsInline
              muted
              autoPlay
            />

            {/* Controles */}
            <div  style={styles.controlsVideo}>
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
  btnConfirm:{
    height: "50px",
   
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width:"120px"
  },
  closeButtonImgPreview:{
    position: "absolute",
    top: 0, // Quitar desplazamiento vertical raro
    right: 0, // Quitar desplazamiento horizontal raro
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "50%", // 50% para un círculo perfecto
    width: 18, // Un poco más ancho para que se vea bien la X
    height: 18, // Igual que width para círculo
    fontSize: 12,
    lineHeight: "18px", // Igual que height para centrar la X verticalmente
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 0 2px rgba(0,0,0,0.6)",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    userSelect: "none",
  },
  boxTextImgComment:{
    width: "100%",
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  overlayTakePhoto:{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    zIndex: 9999,
    overflow: "hidden",
  },
  closeOverlayTakePhoto:{
    position: "absolute",
    top: 20,
    right: 20,
    background: "transparent",
    border: "none",
    fontSize: 32,
    color: "#fff",
    cursor: "pointer",
    zIndex: 10000,
  },
  containerButtonTakePhoto:{
    position: "absolute",
    bottom: 140,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    zIndex: 10001,
  },
  closeOverlayImgPreview:{
    position: "absolute",
    top: 66,
    right: 16,
    background: "transparent",
    border: "none",
    fontSize: 24,
    color: "#fff",
    cursor: "pointer",
    zIndex: 10000,
  },
  panelVideoPreview:{
    display: "flex",
    overflowX: "auto",
    gap: "1rem",
    paddingBottom: 12,
  },
  containerVideoPreview:{
    minWidth: 120,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "relative",
  },
  buttonCheckVideoPreview:{
    position: "absolute",
    top: -1, // Quitar desplazamiento vertical raro
    left: -1, // Quitar desplazamiento horizontal raro
    background: "#007AFF",
    color: "#fff",
    border: "none",
    borderRadius: "50%", // 50% para un círculo perfecto
    width: 25, // Un poco más ancho para que se vea bien la X
    height: 25, // Igual que width para círculo
    fontSize: 16,
    lineHeight: "25px", // Igual que height para centrar la X verticalmente
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 0 2px rgba(0,0,0,0.6)",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    userSelect: "none",
    zIndex: 1000,
  },
  closeVideoPreview:{
    position: "absolute",
    top: 0, // Quitar desplazamiento vertical raro
    right: 0, // Quitar desplazamiento horizontal raro
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "50%", // 50% para un círculo perfecto
    width: 25, // Un poco más ancho para que se vea bien la X
    height: 25, // Igual que width para círculo
    fontSize: 16,
    lineHeight: "25px", // Igual que height para centrar la X verticalmente
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 0 2px rgba(0,0,0,0.6)",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    userSelect: "none",
    zIndex: 1000,
  },
  boxTextVideoPreview:{
    width: "100%",
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  buttonPhotos:{
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  },
  informationContainer:{
    backgroundColor: "#e6f0ff",
    color: "#333",
    fontSize: 14,
    padding: "12px 16px",
    borderRadius: 6,
    marginTop: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  informationText:{
     color: "#007aff", 
     fontWeight: "bold", 
     fontSize: 18 
  },
  closeOverlayVideo:{
    position: "absolute",
    top: 66,
    right: 16,
    background: "transparent",
    border: "none",
    fontSize: 24,
    color: "#fff",
    cursor: "pointer",
    zIndex: 10000,
  },
  overlayVideo:{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  closeVideoButton:{
    position: "absolute",
    top: 20,
    right: 20,
    background: "transparent",
    border: "none",
    fontSize: 32,
    color: "#fff",
    cursor: "pointer",
    zIndex: 10000,
  },
  contentVideo:{
    width: "100vw",
    height: "100vh",
    objectFit: "cover", // Asegura que el video llene el contenedor
  },
  controlsVideo:{
    position: "absolute",
    bottom: 120,
    display: "flex",
    gap: 20,
    zIndex: 10001,
  },

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

    fontSize: 14,
    cursor: "pointer",
    width: "130px",
  },
  captureStop: {
    width: "130px",
    backgroundColor: "red",
    color: "#fff",
    border: "none",

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
    fontSize: "16px",
  },
  saveButton: {
    border: "none",

    backgroundColor: "#007AFF",
    color: "#fff",

    cursor: "pointer",
    fontSize: "14px",
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
    textAlign: "center",
    marginRight:"10px"
  },
  takePhotosBtnOff: {
    width: "130px",
    backgroundColor: "white",
    color: "gray",
    border: "1px solid gray",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    marginRight:"10px"
  },
};
