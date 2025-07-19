export default function JobReview({statusJob, dept}) {

  return (
    <section className="step">
      <div className="step-header">
        <div className="title">
         Job Review
        </div> 
        <div className={statusJob==='I' ? "inProgress" : "processing"} >
          <span>{statusJob==='I' ? "In Progress" : "Processing"}</span>
        </div>
         
      </div>

      <div className="bodyContent">
        <hr className="spaceAlt" />

        <div className="subTitleStep4">
          <b className="subTitleText">
          {statusJob==='I' ? "Job Successfully Submitted!" : "Your work has been submitted for payment"}
            <br />
            <br />{" "}
          </b>
          {statusJob==='I' && (
             <div>Thank you for completing the cleaning service at <b className="subTitleTextRoom">{dept}</b><br /><br /> We've received your photos and confirmed the location. Our team will  review everything shortly.
            </div>
          )}

          {statusJob==='P' && (
            <div>
              Payments are processed based on your membership tier.
            </div>
          )} 
           
        </div>
      </div>

      <div />
    </section>
  );
}
