import { useEffect, useState } from 'react'
//import { getData, postData } from '../src/services/api';
import { getJobData, postJobData, putImg , uploadToS3Blob } from './services/api.v1';
import { useParams , useLocation} from 'react-router-dom';
 

import './App.css';
// App
import Header from './components/Header'
import NavBar from './components/NavBar'
import JobInfo from './components/JobInfo'
import StartJob from './components/StartJob';
import EndJob from './components/EndJob';
import JobReview from './components/JobReview';
import Payment from './components/Payment';

import {formatDate} from './utils/misc';

let locationStatus  = 0; 
 
function App() {
  // StartJOb
  const [startJobData, setStartJobData] = useState({
    photos: [],
    isConfirmed: false,
    dateConfirm:null,
    option: 0,
    videos:[]
  });
 // end job
  const [endJobData, setEndJobData] = useState({
    photos: [],
    isConfirmed: false,
    dateConfirm:null,
    option: 0,
    videos:[]
  });

  const activeWindow = useLocation();
  const { idJob } = useParams();
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(false)
 // 0 = fail, 1=done, 2=need access, 3=not supported
 const [idFromUrl, setIdFromUrl] = useState(null);

 useEffect(() => {
  if (!idJob) return;

  console.log('ID desde URL:', idJob);
  // Aquí puedes hacer tu fetch a la API usando ese id
}, [idJob]);
 
 useEffect(() => {
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

      if (
        data.tracker?.status === "S1" &&
        data.tracker?.data?.tracker?.step1?.dayApproved
      ) {
        completarPaso(2);
        return {
          ...baseData,
          dateConfirm: formatDate(data.tracker.data.tracker.step1.dayApproved),
        };
      }

      return baseData;
    });
  })
    .catch(err => console.error('GET Fail:', err));
}, []);




  useEffect(() => {
    console.log(1)
    //const params = new URLSearchParams(activeWindow.search);
    //const id = params.get('idJob'); // o el nombre que uses en la URL
     //alert(id)
    //if (id) setIdFromUrl(id);
    
  }, [activeWindow.search]);

  const confirmLocation = async(num) => {
    const formatted = formatDate();
    setJobInfoData({
      ...jobInfoData,
      dateConfirm : formatted,
      locationBrowser : location
    })  

    let response  = await postJobData(
      { 
        trackerId: idJob, 
        step1: {
          location: {
            geo : [jobInfoData.location.lat,jobInfoData.location.lng],
            geoApp: [location.lat, location.lng]
          }
        } 
      }
    );
    console.log("waiting response!!")
    console.log(response);
    completarPaso(2);
  }
 
  /****************************************/
  const getLocation = () => {
    console.log(2)
    if (!navigator.geolocation) {
      locationStatus = 3
      //setError("Geolocation not supported")
      return
    }    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        locationStatus = 1
        setError(false)
      },
      (err) => {
        if (err.code === 1) {
          // PERMISSION_DENIED
          locationStatus = 2
          //setError("We couldn't access your location. Please enable location services in your device settings to continue.")
        } else {
          locationStatus=0
          //setError("Error getting location.")
        }
      }
    )
  }

  useEffect(() => {
    getLocation()
    if (!idFromUrl) return;
/*
    getData(idFromUrl)
    .then((data) => {
      setJobInfoData((prev) => ({
        ...prev,
        idJob: data.number,
        name : data.property.name,
        address : data.property.location.address1 +', '+data.property.location.city+', '+ data.property.location.state +' ' + data.property.location.postalCode ,
        unit: "unit - " + data.unit,
        locationn : {
          lat: data.property.location.geo.coordinates[0],
          lng: data.property.location.geo.coordinates[1],
        },
        cleaningType : data.service.name,
        scheduled :  data.scheduleDate,
      }));
    })
    .catch(err => console.error(err));*/

    
  }, [idFromUrl])

  //  onStatusChange={updateIconStatus} 
  const confirmLocationX = () => {
 
    const formatted = formatDate();
    //setDateConfirm(formatted);
    setJobInfoData({
      ...jobInfoData,
      dateConfirm : formatted,
      locationBrowser : location
    })
    completarPaso(2);
   }
  // steps 
  const [currentStep, setCurrentStep] = useState(1);
  const [enabledSteps, setEnabledSteps] = useState([1,5,4]);

  const completarPaso = (num) => {
    setEnabledSteps(prev => [...new Set([...prev, num])]);
    setCurrentStep(num);
  };

  const confirmStarJOb =  async() => {
    
   let response = null;
   let datafiles = null;
 
    if(startJobData.option==2){
      
      datafiles = await uploadAllVideos(startJobData);  

    } else {
      datafiles= await uploadAllPhotos(startJobData);
    }

    let request = { 
      trackerId: idJob, 
      step2: {
        location: {
          geo : [jobInfoData.location.lat,jobInfoData.location.lng],
          geoApp: [location.lat, location.lng]
        },
        media: startJobData.option,
        files: datafiles          
      } 
    }
    response  = await postJobData(request);

    console.log("waiting response!!")
    console.log(response);
    completarPaso(3);

  }
  async function uploadAllPhotos(data) {
    let photoDB = {
      items: []
    };
  
    for (let i = 0; i < data.photos.length; i++) {
      const { image, comment, blod } = data.photos[i];
  
      const fileType = blod.type; // ej: 'image/jpeg'
      const fileSize = blod.size;
      const fileName = `photo_${i}`; // puedes usar un índice para diferenciar
  
      let fileNameS3 = '';
      let urlS3 = '';
  
      try {
        
        const cleanMimeType = fileType.split(';')[0];
        let downloadUrl = await uploadToS3Blob(blod, fileName, cleanMimeType, fileSize);
        fileNameS3 = downloadUrl.fileNameS3;
        urlS3 = downloadUrl.url;
      } catch (e) {
        console.error('Error subiendo foto:', e);
      }
  
      photoDB.items.push({
        comment: comment,
        downloadUrl: urlS3,
        fileNameS3: fileNameS3
      });
    }
  
    return photoDB;
  }
   
 
async function uploadAllVideos(data) {
  let videoDB = {
    items : []
  };
  for (let i = 0; i < data.videos.length; i++) {
    const { url, comment, blob , type} = data.videos[i];
     
    const fileType = type; // ej: 'video/webm'
    const fileSize = blob.size;
    const fileName = `video`;
    
    let fileNameS3 = '';
    let urlS3 = '';
    try {
      console.log(fileName, fileType, fileSize);
      const cleanMimeType = fileType.split(';')[0]
      let downloadUrl = await uploadToS3Blob(blob, fileName, cleanMimeType, fileSize);
      fileNameS3 = downloadUrl.fileNameS3;
      urlS3 = downloadUrl.url;
 
    } catch (e) {

      console.error('Error subiendo video:', e);
    }
    videoDB.items.push({
      comment : comment,
      downloadUrl: urlS3,
      fileNameS3: fileNameS3
    }); 

  }
  return videoDB;
}

 
  const confirmEndJOb =  () => {
    completarPaso(4)
  }
 // JobInfo
 const [jobInfoData, setJobInfoData] = useState({
    idJob: "XXXX",
    name : "David Room",
    address : "Jr comercio 987, Cañete, Cerro Azul 9898",
    unit: "AB987",
    location : {
      lat: -98987897,
      lng: +898798798,
    },
    cleaningType : "Cleaner All",
    scheduled : "Friday, December 27th, 2024",
    instructions : "Enter through the back gate using code 4832. Pets on premises.",
    dateConfirm: null,
    locationBrowser: null 
 })
  
  
  // STATUS PAYMENT
  const [paymentStatus, setPaymentStatus]  = useState('I'); //I(inprogress) P (processing) D (done paid) 
  const [department, setDepartment]  = useState(jobInfoData.name + ' - ' + jobInfoData.unit);


  return (
    <div className="App">
       <Header data={jobInfoData} />
       <NavBar 
          currentStep={currentStep}
          enabledSteps={enabledSteps}
          onStepChange={setCurrentStep} 
           />

       {currentStep === 1 && <JobInfo locationStatus={locationStatus}  onStatusChange={confirmLocation} data={jobInfoData} />}
       {currentStep === 2 && <StartJob data={startJobData} setData={setStartJobData} startJobConfirmed={confirmStarJOb} model={1}/>}
       {currentStep === 3 && <StartJob data={endJobData} setData={setEndJobData} startJobConfirmed={confirmEndJOb}  model={2}/>}
       {currentStep === 4 && <JobReview statusJob={paymentStatus} dept={department} />}
       {currentStep === 5 && <Payment statusJob={paymentStatus}/>}
    </div>
  );
}

export default App;
