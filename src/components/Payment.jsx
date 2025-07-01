export default function Payment() {
    return (
      <section className="step">
        <div className="step-header">
          <h2>Payment</h2>
          <div className="paid">
            <span>Paid</span>
          </div>
        </div>
  
        <div className="bodyContent">
          <hr className="spaceAlt" />
  
          <div className="subTitleStep4">
            <b className="subTitleTextPaid">
            Payment processed
              <br />
              <br />{" "}
            </b>
            This job has already been paid. Please check your Money section for payment details.
          </div>
        </div>
  
        <div />
      </section>
    );
  }