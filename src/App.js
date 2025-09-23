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
import HeaderPro from "./components/HeaderPro";
import Footer from "./components/Footer";

import LocationTab from "./components/LocationTab";
import Before from "./components/Before"
import After from "./components/After"
import Summary from "./components/Summary"

import AppModal1 from "./components/modals/AppModal1";
import AppModal2 from "./components/modals/AppModal2";
import AppModal3 from "./components/modals/AppModal3";


import Header from "./components/Header";
import NavBar from "./components/NavBar";
import JobInfo from "./components/JobInfo";
import StartJob from "./components/StartJob"; 
import JobReview from "./components/JobReview";
import Payment from "./components/Payment";

import { formatDate, getFormattedDate, getFormattedDateV2 } from "./utils/misc";

let locationStatus = 0;

function App() {
  console.log("v1.2");
  const [showModal, setShowModal] = useState(true);
  /* MODALS */
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);

  /* ***** *  */

  let dateFormatted = getFormattedDateV2();
  let activeDB = true;
  // StartJOb
  const [startJobData, setStartJobData] = useState({
    activeFoot: false,
    photos: [[], [], [], [], [], [], []],
    isConfirmed: false,
    dateConfirm: '',
    option: 0,
    videos: [],
    viewBtn: true
  });
  // end job
  const [endJobData, setEndJobData] = useState({
    activeFoot: false,
    photos: [[], [], [], [], [], []],
    isConfirmed: false,
    dateConfirm: '',
    option: 0,
    videos: [],
    viewBtn: true
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
    dateConfirm: '',
    locationBrowser: null,
    isConfirmed: false
  });
  /********************************************************************************* */

  let MenuActive = null;
  let MenuActiveList = [1000]
  const [currentMenuActive, setCurrentMenuActive] = useState(MenuActive);
  const [currentMenuActiveList, setCurrentMenuActiveList] = useState(MenuActiveList);

  /********************************************************************************* */
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
    if (activeDB) {
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
                dateConfirm: data.tracker.data.tracker.step1.dateConfirm,
                isConfirmed: true
              };
            }

            return baseData;
          });

          if (data.tracker?.data?.tracker?.step2?.dayApproved) {
            //media = 1 photos  photos: []
            //media = 2 videos  videos: []
            setStartJobData((prev) => {
              let baseMedia = [];
              let iniPhotos = [];
              let iniVideos = [];

              const items1 = data.tracker?.data?.tracker?.step2?.files?.items;

              if (Array.isArray(items1)) {
               

                for (let arr of items1) {
                  let arrAct = [];
                  for( let itemX of arr){
                      if (itemX.downloadUrl) {
                          arrAct.push({
                            photo: itemX.downloadUrl,
                            comment: itemX.comment || "",
                            blob : ""
                          });
                      }
                  }  
                  baseMedia.push(arrAct);    
                }       
              }
               
              iniPhotos = baseMedia;
               

              const baseData = {
                ...prev,
                isConfirmed: true,
                dateConfirm:  data.tracker.data.tracker.step2.dateConfirm ,
                option: data.tracker.data.tracker.step2.media,
                photos: iniPhotos,
                videos: iniVideos,
              };
              console.log(baseData);
              return baseData;
            });
          }

          if (data.tracker?.data?.tracker?.step3?.dayApproved) {
            setEndJobData((prev) => {
              let baseMedia2 = [];
              let iniPhotos2 = [];
              let iniVideos2 = [];

              const items2 = data.tracker?.data?.tracker?.step3?.files?.items;
              
              if (Array.isArray(items2)) {
               

                for (let arr2 of items2) {
                  let arrAct2 = [];
                  for( let itemX2 of arr2){
                      if (itemX2.downloadUrl) {
                          arrAct2.push({
                            photo: itemX2.downloadUrl,
                            comment: itemX2.comment || "",
                            blob : ""
                          });
                      }
                  }  
                  baseMedia2.push(arrAct2);    
                }       
              }
                iniPhotos2 = baseMedia2;
               

              const baseData = {
                ...prev,
                isConfirmed: true,
                dateConfirm: data.tracker.data.tracker.step3.dateConfirm,
                option: data.tracker.data.tracker.step3.media,
                photos: iniPhotos2,
                videos: iniVideos2,
              };
              console.log(baseData);
              return baseData;
            });
          }

          if (data.tracker?.status) {
            switch (data.tracker?.status) {
              case "E":
                activeTabs([1]);
                if (data.tracker?.data?.tracker && !('noti1' in data.tracker.data.tracker)) {
                  setShowModal1(true);
                }
                
                break;
              case "S1":
                activeTabs([1, 2]);
                if (data.tracker?.data?.tracker && !('noti2' in data.tracker.data.tracker)) {
                  setShowModal2(true);
                }
                break;
              case "S2":
                activeTabs([1, 2, 3]);
                if (data.tracker?.data?.tracker && !('noti3' in data.tracker.data.tracker)) {
                  setShowModal3(true);
                }
                break;
              case "S3":
                
                activeTabs([4]);
               // setPaymentStatus("I");
                break;
              case "In":
                activeTabs([1, 2, 3, 4]);
                setPaymentStatus("P");
                break;
              case "Pr":
                activeTabs([1, 2, 3, 5]);
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
      setCurrentMenuActiveList((prev) => [...new Set([...prev, num])]);
      lastNum = num;
    }
    setCurrentMenuActive(lastNum);
  }

  useEffect(() => {
  }, [activeWindow.search]);

  const confirmLocation = async (num) => {
    // formatted = formatDate();
    setJobInfoData({
      ...jobInfoData,
      isConfirmed: true,
      dateConfirm: dateFormatted,
      locationBrowser: location,
    });

    let response = await postJobData({
      trackerId: idJob,
      step1: {
        dateConfirm: dateFormatted,
        location: {
          geo: [jobInfoData.location.lat, jobInfoData.location.lng],
          geoApp: [location.lat, location.lng],
        },
      },
    });
    console.log(response);
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
    setCurrentMenuActiveList((prev) => [...new Set([...prev, num])]);
    setCurrentMenuActive(num);

    /*
    const [currentMenuActive, setCurrentMenuActive] = useState(MenuActive);
  const [currentMenuActiveList, setCurrentMenuActiveList] = useState(MenuActiveList);
    
    */
  };

  const confirmStarJOb = async () => {

    setStartJobData({ 
              ...startJobData,
              viewBtn : false
    });

    let response = null;
    let datafiles = null;

  
    datafiles = await uploadAllPhotos(startJobData);
    let dataStr =  getFormattedDate(); 
    let request = {
      trackerId: idJob,
      step2: {
        location: {
          geo: [jobInfoData.location.lat, jobInfoData.location.lng],
          geoApp: [location.lat, location.lng],
        },
        media: startJobData.option,
        files: datafiles,
        dateConfirm:  dataStr
      },
    };
    response = await postJobData(request);
    if (response.acknowledged) {
      
      console.log(55, dataStr);
      
      setStartJobData({ 
              ...startJobData,
              isConfirmed : true,
              viewBtn : true,
              dateConfirm: dataStr
      });
      console.log(33, startJobData);
      completarPaso(3);
      //actualiza todo el objeto recien
      
      /*************************************************************** */
    } else {
      // agregar algo cuando sale error
      // reiniciamos el boton para intentar de nuevo
    }
  };

  async function saveNotification1() {
    console.log('si vao por aca')
    let request = {
      trackerId: idJob,
      noti1 : '1'
    };
    let response = await postJobData(request);
    if (response.acknowledged) {
      setShowModal1(false);
    }
  }

  async function saveNotification2() {
    let request = {
      trackerId: idJob,
      noti2 : '2'
    };
    let response = await postJobData(request);
    if (response.acknowledged) {
      setShowModal2(false);
    }
  }

  async function saveNotification3() {
    let request = {
      trackerId: idJob,
      noti3 : '3'
    };
    let response = await postJobData(request);
    if (response.acknowledged) {
      setShowModal3(false);
    }
  }

  async function uploadAllPhotos(data) {
    let photoDB = {
      items: [],
    };

    for (let X = 0; X < data.photos.length; X++) {
      const stepPhotos = data.photos[X];
      let item = [];
      // aca pregunto si es el ultimo elemento puede ir vacio
      if(stepPhotos.length!==0){      
        for (let i = 0; i < stepPhotos.length; i++) {
            
          const { image, comment, blob } = stepPhotos[i];

          const fileType = blob.type; // ej: 'image/jpeg'
          const fileSize = blob.size;
          const fileName = `photo_${i}`; // puedes usar un índice para diferenciar

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
            console.error("Error subiendo foto:", e);
          }

          item.push({
            comment: comment,
            downloadUrl: urlS3,
            fileNameS3: fileNameS3,
          });

        }
      }
      photoDB.items.push(item);
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

    setEndJobData({ 
              ...endJobData,
              viewBtn : false
      });

      
    datafiles = await uploadAllPhotos(endJobData);
    

    let request = {
      trackerId: idJob,
      step3: {
        location: {
          geo: [jobInfoData.location.lat, jobInfoData.location.lng],
          geoApp: [location.lat, location.lng],
        },
        media: endJobData.option,
        files: datafiles,
        dateConfirm: getFormattedDate()
      },
    };
    response = await postJobData(request);
    if (response.acknowledged) {
      setEndJobData({ 
              ...endJobData,
              isConfirmed : true,
              viewBtn : true,
              dateConfirm:getFormattedDate()
      });
      console.log(44,endJobData);
      completarPaso(4);
    } else {
      // agregar algo cuando sale error
      // reiniciamos el boton para intentar de nuevo
    }
  };
  // STATUS PAYMENT
  const [paymentStatus, setPaymentStatus] = useState("I"); //I(inprogress) P (processing) D (done paid)
  const department =     jobInfoData.name + " - " + jobInfoData.unit;
  
  
  /********************************************************************************************** */
  // NUEVAS FUNCIONES 
  /********************************************************************************************** */

  return (
    <div className="App">
         <HeaderPro
            mainSetCurrentStep={currentMenuActive}
            mainSetCurrentMenuActive={setCurrentMenuActive}
            mainCurrentMenuActiveList ={currentMenuActiveList}
            dataJob={jobInfoData}
         /> 

         {currentMenuActive === 1 && (
        <LocationTab
                locationStatus={locationStatus}
                formattedDate={dateFormatted}
                data={jobInfoData}
        />
        )}
         {currentMenuActive === 2 && (
          <Before
                mainstartJobData = {startJobData} 
                mainSetStartJobData = {setStartJobData}
         />
         )}

         {currentMenuActive === 3 && (
          <After
                mainstartJobData = {endJobData} 
                mainSetStartJobData = {setEndJobData}
         />
         )}

        {currentMenuActive === 4 && (
          <Summary
              mainstartJobData = {startJobData} 
              mainendJobData = {endJobData}
          />
         )}


         <Footer
            MainCurrentMenuActive={currentMenuActive}
            MainJobInfoData = {jobInfoData}
            MainStartJobData = {startJobData}
            onStatusChange={confirmLocation}
            confirmStarJOb={confirmStarJOb}
            MainEndJobData = {endJobData}
            confirmEndJOb={confirmEndJOb}
         />

         {/* Modal */}
        <AppModal1 show={showModal1} onClose={() => setShowModal1(false)}  onDontShowAgain={saveNotification1} />
        <AppModal2 show={showModal2} onClose={() => setShowModal2(false)}  onDontShowAgain={saveNotification2} />
        <AppModal3 show={showModal3} onClose={() => setShowModal3(false)}  onDontShowAgain={saveNotification3} />
    </div>

    
  );
}

export default App;
