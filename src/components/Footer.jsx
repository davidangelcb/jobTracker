
import "./Footer.css";
/*
MainCurrentMenuActive={currentMenuActive}
            MainJobInfoData = {jobInfoData}
            onStatusChange={confirmLocation}

*/
function Footer({MainCurrentMenuActive, MainJobInfoData,  MainStartJobData, onStatusChange, confirmStarJOb}) {
    console.log(MainCurrentMenuActive)
    let btn = '&nbsp;';
    switch (MainCurrentMenuActive) {
        case 1:
            if(MainJobInfoData.isConfirmed===false) {
            btn = (<button className="footer-btn" onClick={onStatusChange} >Start Job</button> );
            if(MainJobInfoData.dateConfirm!=null){
                    btn = (<button className="footer-btn disabledBtn" >Start Job</button> ); 
                } 
            }
            
            break;
        case 2:
            
            if(MainStartJobData.isConfirmed===false) {
                btn = (<button className="footer-btn disabledBtn">Submit Before Photos</button> );
                if (MainStartJobData.activeFoot){
                    btn = (<button className="footer-btn" onClick={confirmStarJOb}>Submit Before Photos</button> );
                }
            }
            
            break;
        case 3: 
            btn = (<button className="footer-btn">Submit After Photos</button> );
            break;    
        default:
            break;
    }
 
  return (
    <footer className="App-footer">
        {btn}
        <svg width="36" height="35" viewBox="0 0 36 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.9994 0C8.07436 0 0 7.28846 0 16.2455C0 25.2025 8.07436 32.491 17.9994 32.491C19.9443 32.491 21.8759 32.1999 23.7507 31.6261L27.7916 34.7199C28.0332 34.9058 28.3195 35 28.6082 35C28.8123 35 29.0177 34.9535 29.2098 34.8569C29.6724 34.6257 29.9611 34.1559 29.9611 33.6311V28.3782C33.8062 25.2918 36 20.9002 36 16.2455C35.9988 7.28846 27.9244 0 17.9994 0ZM18.7725 24.0942C18.5672 24.3022 18.2893 24.4123 17.9994 24.4123C17.7095 24.4123 17.4316 24.3022 17.2263 24.0942C17.1296 23.9964 17.0451 23.874 16.9967 23.7395C16.9363 23.6061 16.9122 23.4593 16.9122 23.3113C16.9122 23.1633 16.9363 23.03 16.9967 22.8954C17.0451 22.7608 17.1296 22.6385 17.2263 22.5406C17.637 22.1247 18.3618 22.1247 18.7725 22.5406C18.8692 22.6385 18.9537 22.7608 19.002 22.8954C19.0624 23.0287 19.0866 23.1755 19.0866 23.3113C19.0866 23.6049 18.9658 23.8863 18.7725 24.0942ZM20.1267 18.0376C19.4853 18.3692 19.0866 18.9906 19.0866 19.661C19.0866 20.269 18.5998 20.7619 17.9994 20.7619C17.399 20.7619 16.9122 20.269 16.9122 19.661C16.9122 18.1588 17.765 16.785 19.1386 16.0767C20.0083 15.6277 20.7488 14.5647 20.4444 13.1982C20.2366 12.2636 19.5034 11.5297 18.578 11.3266C17.2359 11.0281 16.1922 11.7841 15.7549 12.6624C15.5773 13.0184 15.4867 13.4025 15.4867 13.8075C15.4867 14.4154 14.9999 14.9084 14.3995 14.9084C13.7991 14.9084 13.3123 14.4154 13.3123 13.8075C13.3123 13.0674 13.4851 12.3285 13.8136 11.6716C14.7776 9.73507 16.9279 8.71238 19.0407 9.17479C20.7887 9.55891 22.1731 10.9486 22.5669 12.715C23.0453 14.8607 22.0414 17.0504 20.1267 18.0376Z" fill="#241D5D"/>
        </svg>
    </footer>
  );
}

export default Footer;