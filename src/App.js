import { useEffect, useState } from 'react'
//import { getData, postData } from '../src/services/api';
import { getJobData, postJobData } from './services/api.v1';

import { useLocation } from 'react-router-dom';

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
  const activeWindow = useLocation();

  const [location, setLocation] = useState(null)
  const [error, setError] = useState(false)
 // 0 = fail, 1=done, 2=need access, 3=not supported
 const [idFromUrl, setIdFromUrl] = useState(null);
 
 useEffect(() => {
  getJobData(123)
    .then(data => console.log('GET OK:', data))
    .catch(err => console.error('GET Fail:', err));

  postJobData({ name: 'David', status: 'started' })
    .then(data => console.log('POST OK:', data))
    .catch(err => console.error('POST Fail:', err));
}, []);




  useEffect(() => {
    console.log(1)
    //const params = new URLSearchParams(activeWindow.search);
    //const id = params.get('idJob'); // o el nombre que uses en la URL
     //alert(id)
    //if (id) setIdFromUrl(id);
    
  }, [activeWindow.search]);

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
    .catch(err => console.error(err));

    
  }, [idFromUrl])

  //  onStatusChange={updateIconStatus} 
  const confirmLocation = () => {
 
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

  const confirmStarJOb =  () => {
    completarPaso(3)
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
    locationn : {
      lat: -98987897,
      lng: +898798798,
    },
    cleaningType : "Cleaner All",
    scheduled : "Friday, December 27th, 2024",
    instructions : "Enter through the back gate using code 4832. Pets on premises.",
    dateConfirm: null,
    locationBrowser: null 
 })
  
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
  // STATUS PAYMENT
  const [paymentStatus, setPaymentStatus]  = useState('I'); //I(inprogress) P (processing) D (done paid) 
  const [department, setDepartment]  = useState(jobInfoData.name + ' - ' + jobInfoData.unit);


  return (
    <div className="App">
       <Header data={jobInfoData} />
       <NavBar 
          currentStep={currentStep}
          enabledSteps={enabledSteps}
          onStepChange={setCurrentStep}  />

       {currentStep === 1 && <JobInfo locationStatus={locationStatus}  onStatusChange={confirmLocation} data={jobInfoData} />}
       {currentStep === 2 && <StartJob data={startJobData} setData={setStartJobData} startJobConfirmed={confirmStarJOb} />}
       {currentStep === 3 && <EndJob data={endJobData} setData={setEndJobData} startJobConfirmed={confirmEndJOb} />}
       {currentStep === 4 && <JobReview statusJob={paymentStatus} dept={department} />}
       {currentStep === 5 && <Payment statusJob={paymentStatus}/>}
    </div>
  );
}

export default App;
