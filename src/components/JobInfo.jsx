export default function JobInfo({ locationStatus, onStatusChange, data }) {

let shareLocationText = ''
let btnConfirm = (
    <button className="off" disabled >Confirm</button>
)
switch (locationStatus) {
    case 0:
    case 2:
        shareLocationText = (
        <div className="locationBox">
            ● We couldn't access your location. Please enable location services in your device settings to continue.
        </div>
        )
        break
    case 1:
        shareLocationText = (
        <div className="locationBox">
            ● Location Shared
        </div>
        )
        btnConfirm = (
            <button  onClick={onStatusChange}>Confirm</button>
        ) 
        break
    default:
        break
}
if(data.dateConfirm!=null){
    btnConfirm = (
        <div className="confirmed">
            <span>Confirmed</span><br/>
            <span className="reduce">{data.dateConfirm}</span>
        </div>
    ) 
}
 

  return (
    <section className="step">
      <div className="step-header">
        <h2>Job Info</h2>
        {btnConfirm}
        </div>
      <div>
         
          <div className="bodyContent">
            <hr className="spaceAlt" />
            <strong>{data.name}</strong>
            <br />
            {data.address}
            <br />
            <strong>{data.unit}</strong>
            <br />
            <span className="location-shared">
              {shareLocationText}
            </span>
            <br />
            <hr className="spaceAlt"/>
            <strong className="subTitle">Cleaning Type</strong>
            <br /> 
            {data.cleaningType}
            <br /><br />
            <strong className="subTitle">Scheduled</strong>
            <br />
            {data.scheduled}
            <br /><br />
            <strong className="subTitle">Special Instructions </strong>
            <br />
            {data.instructions}
            <br />
            <hr className="spaceAlt" />
            <small className="footText">
              PINCH Contact Info
              <br />
              Text: 843-983-1466
              <br />
              Email: Ops@pinchjob.com
            </small>
          </div>
        
      </div>
    </section>
  );
}

 