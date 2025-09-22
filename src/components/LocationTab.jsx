export default function LocationTab({ locationStatus, onStatusChange, data }) {

let shareLocationText = ''
let btnConfirm = (
    <button className="off" disabled >Confirm</button>
)
switch (locationStatus) {
    case 0:
    case 2:
        shareLocationText = (
        <div className="locationBox1">
            Location Shared
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
      </div>
      <div className="step-new">
        Payment will be delayed if you fail to Share Location.
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
            <div className="location-shared">
              {shareLocationText}
              <div className="datetime">02:41 PM-06/04/2025</div>
            </div>
             
            <hr className="spaceAlt"/>
            <div className="subTitle">
               <b>Cleaning Type</b>
            </div>
            <div className="subTitleContent">
               {data.cleaningType}
            </div>
            <div className="subTitle">
                <b >Scheduled</b>
            </div>
            <div className="subTitleContent">
            {data.scheduled}
            </div>
             <div className="subTitle">
                <b >Special Instructions </b>
            </div>
           <div className="subTitleContent">
            {data.instructions}
            </div>
            
            <hr className="spaceAlt" />
            <small className="footText">
              <div className="subTitle">
                <b  >PINCH Contact Info</b><br/><br/>
            </div>
              <div>
              Text-Only: <a className="email" target="_blank" href="sms:+18439831466?body=Hello Pinch!">843-983-1466</a>
              </div>
              <div>
              Email: <a className="email" href="mailto:Ops@pinchjob.com">Ops@pinchjob.com</a>
              </div>
            </small>
          </div>
        
      </div>
    </section>
  );
}

 