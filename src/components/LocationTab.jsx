

export default function LocationTab({ locationStatus, formattedDate, data }) {

let shareLocationText = ''
 
let dateShare = '';
switch (locationStatus) {
    case 0:
    case 2:
      if(data.dateConfirm=='') {
        shareLocationText = (
        <div className="locationBox1">
            Share Location 
        </div>
        )
      } else {
        dateShare = dateShare.dateConfirm;
         shareLocationText = (
        <div className="locationBox">
            ● Location Shared
        </div>
        )
      }
        break
    case 1:
        if(data.dateConfirm=='') {
          dateShare = formattedDate;
        }  else {
          dateShare = dateShare.dateConfirm;
        }
        
        shareLocationText = (
        <div className="locationBox">
            ● Location Shared
        </div>
        )
         
        break
    default:
        break
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
              <div className="datetime">{dateShare}</div>
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

 