export default function Payment() {
    return (
      <section className="step">
        <div className="step-header">
        <div className="title">Payment</div>
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