
import "./Footer.css";
/*
MainCurrentMenuActive={currentMenuActive}
            MainJobInfoData = {jobInfoData}
            onStatusChange={confirmLocation}

*/
function Footer({MainCurrentMenuActive, MainJobInfoData,  MainStartJobData, onStatusChange, confirmStarJOb, MainEndJobData, confirmEndJOb , locationStatus}) {
    
    let btn = (<span>&nbsp;</span>);
    let info= (
                <svg width="36" height="35" viewBox="0 0 36 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.9994 0C8.07436 0 0 7.28846 0 16.2455C0 25.2025 8.07436 32.491 17.9994 32.491C19.9443 32.491 21.8759 32.1999 23.7507 31.6261L27.7916 34.7199C28.0332 34.9058 28.3195 35 28.6082 35C28.8123 35 29.0177 34.9535 29.2098 34.8569C29.6724 34.6257 29.9611 34.1559 29.9611 33.6311V28.3782C33.8062 25.2918 36 20.9002 36 16.2455C35.9988 7.28846 27.9244 0 17.9994 0ZM18.7725 24.0942C18.5672 24.3022 18.2893 24.4123 17.9994 24.4123C17.7095 24.4123 17.4316 24.3022 17.2263 24.0942C17.1296 23.9964 17.0451 23.874 16.9967 23.7395C16.9363 23.6061 16.9122 23.4593 16.9122 23.3113C16.9122 23.1633 16.9363 23.03 16.9967 22.8954C17.0451 22.7608 17.1296 22.6385 17.2263 22.5406C17.637 22.1247 18.3618 22.1247 18.7725 22.5406C18.8692 22.6385 18.9537 22.7608 19.002 22.8954C19.0624 23.0287 19.0866 23.1755 19.0866 23.3113C19.0866 23.6049 18.9658 23.8863 18.7725 24.0942ZM20.1267 18.0376C19.4853 18.3692 19.0866 18.9906 19.0866 19.661C19.0866 20.269 18.5998 20.7619 17.9994 20.7619C17.399 20.7619 16.9122 20.269 16.9122 19.661C16.9122 18.1588 17.765 16.785 19.1386 16.0767C20.0083 15.6277 20.7488 14.5647 20.4444 13.1982C20.2366 12.2636 19.5034 11.5297 18.578 11.3266C17.2359 11.0281 16.1922 11.7841 15.7549 12.6624C15.5773 13.0184 15.4867 13.4025 15.4867 13.8075C15.4867 14.4154 14.9999 14.9084 14.3995 14.9084C13.7991 14.9084 13.3123 14.4154 13.3123 13.8075C13.3123 13.0674 13.4851 12.3285 13.8136 11.6716C14.7776 9.73507 16.9279 8.71238 19.0407 9.17479C20.7887 9.55891 22.1731 10.9486 22.5669 12.715C23.0453 14.8607 22.0414 17.0504 20.1267 18.0376Z" fill="#241D5D"/>
                </svg>);
    switch (MainCurrentMenuActive) {
        case 1:
            if(MainJobInfoData.isConfirmed===false || locationStatus===1) {
                btn = (<button className="footer-btn" onClick={onStatusChange} >Start Job</button> );
                if(MainJobInfoData.dateConfirm!=''){
                    btn = (<button className="footer-btn disabledBtn" >Start Job</button> ); 
                } 
            }
            
            break;
        case 2:
            if(MainStartJobData.viewBtn){ 
                if(MainStartJobData.isConfirmed===false) {
                    btn = (<button className="footer-btn disabledBtn">Submit Before Photos</button> );
                    if (MainStartJobData.activeFoot){
                        btn = (<button className="footer-btn" onClick={confirmStarJOb}>Submit Before Photos</button> );
                    }
                } 
            } else {
                btn = (<span className="wait">&nbsp;&nbsp;&nbsp;&nbsp;wait please...</span>);
            }
            
            break;
        case 3: 
            if(MainEndJobData.viewBtn) {
                if(MainEndJobData.isConfirmed===false) {
                    btn = (<button className="footer-btn disabledBtn">Submit After Photos</button> );
                    if (MainEndJobData.activeFoot){
                        btn = (<button className="footer-btn" onClick={confirmEndJOb}>Submit After Photos</button> );
                    }
                }
            } else {
                btn = (<span className="wait">&nbsp;&nbsp;&nbsp;&nbsp;wait please...</span>);
            }
            break;    

        case 4:
            info = (<div className="summary_info-box">
        <div className="summary_info-icon">
          <svg
            width="26"
            height="25"
            viewBox="0 0 26 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 25C19.875 25 25.5 19.375 25.5 12.5C25.5 5.625 19.875 -2.3991e-06 13 -3.00013e-06C6.125 -3.60117e-06 0.5 5.625 0.499999 12.5C0.499999 19.375 6.125 25 13 25ZM13 6.25C13.75 6.25 14.25 6.75 14.25 7.5C14.25 8.25 13.75 8.75 13 8.75C12.25 8.75 11.75 8.25 11.75 7.5C11.75 6.75 12.25 6.25 13 6.25ZM11.75 12.5C11.75 11.75 12.25 11.25 13 11.25C13.75 11.25 14.25 11.75 14.25 12.5L14.25 17.5C14.25 18.25 13.75 18.75 13 18.75C12.25 18.75 11.75 18.25 11.75 17.5L11.75 12.5Z"
              fill="#241D5D"
            />
          </svg>
        </div>
        <div className="summary_info-text">
          We successfully received your before and after photos. If you need to
          make any changes, please contact us.
          <br />
          <br />
          Text Only:{" "}
          <a href="sms:8439831466" className="summary_link">
            843-983-1466
          </a>
          <br />
          Email:{" "}
          <a href="mailto:Ops@pinchjob.com" className="summary_link">
            Ops@pinchjob.com
          </a>
        </div>
      </div>);
            break;    
        default:
            break;
    }
 
  return (
    <footer className="App-footer">
        {btn}
        {info}
    </footer>
  );
}

export default Footer;