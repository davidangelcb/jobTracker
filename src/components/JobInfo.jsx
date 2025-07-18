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
            <button className="confirmBtn"  onClick={onStatusChange}>Confirm</button>
        ) 
        break
    default:
        break
}
if(data.dateConfirm!=null){
    btnConfirm = (
        <div className="confirmed">
            <div className="confirmedText">Confirmed</div>
            <div className="reduce">{data.dateConfirm}</div>
        </div>
    ) 
}
 

  return (
    <section className="step">
      <div className="step-header">
        <h2><b>Job Info</b></h2>
        {btnConfirm}
        </div>
      <div>
         
          <div className="bodyContent">
            <hr className="spaceAlt" />
            <b>{data.name}</b>
            <br />
            {data.address}
            <br />
            <b>{data.unit}</b>
            <br />
            <span className="location-shared">
              {shareLocationText}
            </span>
            <br />
            <hr className="spaceAlt"/>
            <b className="subTitle">Cleaning Type</b>
            <br /> 
            {data.cleaningType}
            <br /><br />
            <b className="subTitle">Scheduled</b>
            <br />
            {data.scheduled}
            <br /><br />
            <b className="subTitle">Special Instructions </b>
            <br />
            {data.instructions}
            <br />
            <hr className="spaceAlt" />
            <small className="footText">
              PINCH Contact Info
              <br />
              Text: 843-983-1466
              <br />
              Email: <a className="email" href="mailto:Ops@pinchjob.com">Ops@pinchjob.com</a>
            </small>
          </div>
        
      </div>
    </section>
  );
}

 