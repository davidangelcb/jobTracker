import { useEffect, useState } from "react";
//import { getData, postData } from '../src/services/api';
import {
  getJobData,
  postJobData,
  uploadToS3Blob,
} from "./services/api.v1";
import { useParams, useLocation } from "react-router-dom";

import "./App.css";
// App
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import JobInfo from "./components/JobInfo";
import StartJob from "./components/StartJob"; 
import JobReview from "./components/JobReview";
import Payment from "./components/Payment";

import { formatDate } from "./utils/misc";

let locationStatus = 0;

function App() {
  let activeDB = true;
  // StartJOb
  const [startJobData, setStartJobData] = useState({
    photos: [],
    isConfirmed: false,
    dateConfirm: null,
    option: 0,
    videos: [],
  });
  // end job
  const [endJobData, setEndJobData] = useState({
    photos: [],
    isConfirmed: false,
    dateConfirm: null,
    option: 0,
    videos: [],
  });
  // JobInfo
  const [jobInfoData, setJobInfoData] = useState({
    idJob: "XXXX",
    name: "David Room",
    address: "Jr comercio 987, Cañete, Cerro Azul 9898",
    unit: "AB987",
    location: {
      lat: -98987897,
      lng: +898798798,
    },
    cleaningType: "Cleaner All",
    scheduled: "Friday, December 27th, 2024",
    instructions:
      "Enter through the back gate using code 4832. Pets on premises.",
    dateConfirm: null,
    locationBrowser: null,
  });

  let actDefault = null;
  let enaStepsDefault = [1000];
  if(!activeDB){
      actDefault = 1;
      enaStepsDefault = [1,2,3,4,5];
  }
  
  const [currentStep, setCurrentStep] = useState(actDefault);
  const [enabledSteps, setEnabledSteps] = useState(enaStepsDefault);  

  const activeWindow = useLocation();
  const { idJob } = useParams();
  const [location, setLocation] = useState(null);

  // 0 = fail, 1=done, 2=need access, 3=not supported
  useEffect(() => {
    if (!idJob) return;
  }, [idJob]);

  useEffect(() => {
    if(activeDB){
    getJobData(idJob)
      .then((data) => {
        
          setJobInfoData((prev) => {
            const baseData = {
              ...prev,
              idJob: data.number,
              name: data.property.name,
              address: `${data.property.location.address1}, ${data.property.location.city}, ${data.property.location.state} ${data.property.location.postalCode}`,
              unit: data.unit,
              location: {
                lat: data.property.location.geo.coordinates[0],
                lng: data.property.location.geo.coordinates[1],
              },
              cleaningType: data.service.name,
              scheduled: data.scheduleDate,
            };

            if (data.tracker?.data?.tracker?.step1?.dayApproved) {
              return {
                ...baseData,
                dateConfirm: formatDate(
                  data.tracker.data.tracker.step1.dayApproved
                ),
              };
            }

            return baseData;
          });

          if (data.tracker?.data?.tracker?.step2?.dayApproved) {
            setStartJobData((prev) => {
              const baseData = {
                ...prev,
                isConfirmed: true,
                dateConfirm: formatDate(
                  data.tracker.data.tracker.step2.dayApproved
                ),
                option: data.tracker.data.tracker.step2.media,
              };

              return baseData;
            });
          }

          if (data.tracker?.data?.tracker?.step3?.dayApproved) {
            setEndJobData((prev) => {
              const baseData = {
                ...prev,
                isConfirmed: true,
                dateConfirm: formatDate(
                  data.tracker.data.tracker.step3.dayApproved
                ),
                option: data.tracker.data.tracker.step3.media,
              };

              return baseData;
            });
          }

          if (data.tracker?.status) {
            switch (data.tracker?.status) {
              case "E":
                activeTabs([1]);
                break;
              case "S1":
                activeTabs([1, 2]);
                break;
              case "S2":
                activeTabs([1, 2, 3]);
                break;
              case "S3":
                activeTabs([4]);
                setPaymentStatus("I");
                break;
              case "In":
                activeTabs([4]);
                setPaymentStatus("P");
                break;
              case "Pr":
                activeTabs([5]);
                break;
              case "Pa":
                activeTabs([5]);
                break;
            }
          }
        
      })
      .catch((err) => console.error("GET Fail:", err));
    }
}, []);

  function activeTabs(arr) {
    let lastNum = null;
    for (let num of arr) {
      setEnabledSteps((prev) => [...new Set([...prev, num])]);
      lastNum = num;
    }
    setCurrentStep(lastNum);
  }

  useEffect(() => {
  }, [activeWindow.search]);

  const confirmLocation = async (num) => {
    const formatted = formatDate();
    setJobInfoData({
      ...jobInfoData,
      dateConfirm: formatted,
      locationBrowser: location,
    });

    let response = await postJobData({
      trackerId: idJob,
      step1: {
        location: {
          geo: [jobInfoData.location.lat, jobInfoData.location.lng],
          geoApp: [location.lat, location.lng],
        },
      },
    });
    completarPaso(2);
  };

  /****************************************/
  const getLocation = () => {
    if (!navigator.geolocation) {
      locationStatus = 3;
      //setError("Geolocation not supported")
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        locationStatus = 1;
        //setError(false);
      },
      (err) => {
        if (err.code === 1) {
          // PERMISSION_DENIED
          locationStatus = 2;
          //setError("We couldn't access your location. Please enable location services in your device settings to continue.")
        } else {
          locationStatus = 0;
          //setError("Error getting location.")
        }
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);


  const completarPaso = (num) => {
    setEnabledSteps((prev) => [...new Set([...prev, num])]);
    setCurrentStep(num);
  };

  const confirmStarJOb = async () => {
    let response = null;
    let datafiles = null;

    if (startJobData.option === 2) {
      datafiles = await uploadAllVideos(startJobData);
    } else {
      datafiles = await uploadAllPhotos(startJobData);
    }

    let request = {
      trackerId: idJob,
      step2: {
        location: {
          geo: [jobInfoData.location.lat, jobInfoData.location.lng],
          geoApp: [location.lat, location.lng],
        },
        media: startJobData.option,
        files: datafiles,
      },
    };
    response = await postJobData(request);
    if (response.acknowledged) {
      completarPaso(3);
    } else {
      // agregar algo cuando sale error
      // reiniciamos el boton para intentar de nuevo
    }
  };

  async function uploadAllPhotos(data) {
    let photoDB = {
      items: [],
    };

    for (let i = 0; i < data.photos.length; i++) {
      const { image, comment, blod } = data.photos[i];

      const fileType = blod.type; // ej: 'image/jpeg'
      const fileSize = blod.size;
      const fileName = `photo_${i}`; // puedes usar un índice para diferenciar

      let fileNameS3 = "";
      let urlS3 = "";

      try {
        const cleanMimeType = fileType.split(";")[0];
        let downloadUrl = await uploadToS3Blob(
          blod,
          fileName,
          cleanMimeType,
          fileSize
        );
        fileNameS3 = downloadUrl.fileNameS3;
        urlS3 = downloadUrl.url;
      } catch (e) {
        console.error("Error subiendo foto:", e);
      }

      photoDB.items.push({
        comment: comment,
        downloadUrl: urlS3,
        fileNameS3: fileNameS3,
      });
    }

    return photoDB;
  }

  async function uploadAllVideos(data) {
    let videoDB = {
      items: [],
    };
    for (let i = 0; i < data.videos.length; i++) {
      const { url, comment, blob, type } = data.videos[i];

      const fileType = type; // ej: 'video/webm'
      const fileSize = blob.size;
      const fileName = `video`;

      let fileNameS3 = "";
      let urlS3 = "";
      try {
        const cleanMimeType = fileType.split(";")[0];
        let downloadUrl = await uploadToS3Blob(
          blob,
          fileName,
          cleanMimeType,
          fileSize
        );
        fileNameS3 = downloadUrl.fileNameS3;
        urlS3 = downloadUrl.url;
      } catch (e) {
        console.error("Error subiendo video:", e);
      }
      videoDB.items.push({
        comment: comment,
        downloadUrl: urlS3,
        fileNameS3: fileNameS3,
      });
    }
    return videoDB;
  }

  const confirmEndJOb = async () => {
    let response = null;
    let datafiles = null;

    if (endJobData.option === 2) {
      datafiles = await uploadAllVideos(endJobData);
    } else {
      datafiles = await uploadAllPhotos(endJobData);
    }

    let request = {
      trackerId: idJob,
      step3: {
        location: {
          geo: [jobInfoData.location.lat, jobInfoData.location.lng],
          geoApp: [location.lat, location.lng],
        },
        media: endJobData.option,
        files: datafiles,
      },
    };
    response = await postJobData(request);
    if (response.acknowledged) {
      completarPaso(4);
    } else {
      // agregar algo cuando sale error
      // reiniciamos el boton para intentar de nuevo
    }
  };
  // STATUS PAYMENT
  const [paymentStatus, setPaymentStatus] = useState("I"); //I(inprogress) P (processing) D (done paid)
  const department =     jobInfoData.name + " - " + jobInfoData.unit;
  

  return (
    <div className="App">
      <Header data={jobInfoData} />
      <NavBar
        currentStep={currentStep}
        enabledSteps={enabledSteps}
        onStepChange={setCurrentStep}
      />

      {currentStep === 1 && (
        <JobInfo
          locationStatus={locationStatus}
          onStatusChange={confirmLocation}
          data={jobInfoData}
        />
      )}
      {currentStep === 2 && (
        <StartJob
          data={startJobData}
          setData={setStartJobData}
          startJobConfirmed={confirmStarJOb}
          model={1}
        />
      )}
      {currentStep === 3 && (
        <StartJob
          data={endJobData}
          setData={setEndJobData}
          startJobConfirmed={confirmEndJOb}
          model={2}
        />
      )}
      {currentStep === 4 && (
        <JobReview statusJob={paymentStatus} dept={department} />
      )}
      {currentStep === 5 && <Payment statusJob={paymentStatus} />}
    </div>
  );
}

export default App;
