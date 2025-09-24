import { useEffect, useState } from "react";
import "./AppModal.css";
import sms from "./sms.png";
 

function AppModal5({ show, onClose, MainJobInfoData }) {
  const [copied, setCopied] = useState(false);

  const [checked, setChecked] = useState(false);
  const urlCompleta = window.location.href;
let text= urlCompleta;
 
 
  if (!show) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback viejo
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error("Error copiando al portapapeles:", err);
      // opcional: notificar al usuario
    }
  };


   let textoFooter = '';
   if(copied) {
       textoFooter = (<div className="textoCopiado">texto copiado!</div>)
   }
  return (
    <div className="appmodal_overlay">
      <div className="appmodal_content">
        {/* Botón cerrar */}

        <div className="appmodal_icon">
          <button className="photo-remove-btn2" onClick={onClose}>
            ×
          </button>
          <span role="img" aria-label="camera">
            <svg
              width="49"
              height="49"
              viewBox="0 0 49 49"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24.5" cy="24.5" r="24.5" fill="#EDF7FF" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19.9717 21.9487L28.185 17.8386C27.3004 13.9956 32.0411 11.3746 34.8385 14.1637C37.3249 16.6435 35.5536 20.898 32.0411 20.898C30.8396 20.898 29.7578 20.3644 29.0263 19.5073L20.8131 23.6184C20.9462 24.1978 20.9462 24.8087 20.8131 25.3881L29.0263 29.4982C31.4111 26.7061 35.9977 28.4014 35.9977 32.0525C35.9977 35.5546 31.7308 37.3213 29.2435 34.8416C28.2947 33.8956 27.8745 32.5154 28.1846 31.1676L19.9714 27.0575C17.5866 29.8496 13 28.1543 13 24.5032C13 20.8523 17.5867 19.1559 19.9714 21.9489L19.9717 21.9487Z"
                fill="#0088FF"
              />
            </svg>
          </span>
        </div>

        <p className="appmodal_text">
          Share this URL to allow other team members to complete the job.
        </p>

        <div className="appmodal_text2 centerRedes">
          <div>
        <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24.5" cy="24.5" r="24.5" fill="#27C840"/>
        </svg>
        </div>

            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; 
          <div>
          <svg
            width="49"
            height="49"
            viewBox="0 0 49 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24.5" cy="24.5" r="24.5" fill="#27C880" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M32.9404 17.0518C30.9663 15.0849 28.3409 14.0011 25.5439 14C19.7806 14 15.09 18.6678 15.0877 24.4053C15.0869 26.2393 15.5684 28.0296 16.4834 29.6076L15 35L20.543 33.553C22.0702 34.382 23.7897 34.8188 25.5397 34.8196H25.544C31.3066 34.8196 35.9977 30.1512 36 24.4136C36.0011 21.6331 34.9145 19.0187 32.9404 17.0518ZM25.544 33.062H25.5404C23.981 33.0614 22.4514 32.6445 21.1171 31.8565L20.7998 31.669L17.5105 32.5277L18.3885 29.3361L18.1818 29.0089C17.3119 27.6318 16.8524 26.0402 16.8531 24.406C16.855 19.6372 20.7537 15.7575 25.5474 15.7575C27.8687 15.7584 30.0507 16.6592 31.6916 18.294C33.3324 19.9288 34.2355 22.1019 34.2346 24.4129C34.2326 29.1821 30.334 33.062 25.544 33.062ZM30.311 26.5844C30.0497 26.4543 28.7652 25.8252 28.5257 25.7384C28.2863 25.6517 28.1121 25.6083 27.9379 25.8686C27.7638 26.1289 27.2631 26.7146 27.1106 26.8881C26.9583 27.0616 26.8059 27.0833 26.5446 26.9532C26.2833 26.823 25.4415 26.5485 24.4436 25.6626C23.6669 24.9733 23.1426 24.1217 22.9902 23.8614C22.8378 23.6011 22.974 23.4604 23.1047 23.3308C23.2223 23.2143 23.366 23.0271 23.4966 22.8752C23.6272 22.7234 23.6708 22.615 23.7579 22.4415C23.845 22.2679 23.8014 22.1161 23.7361 21.9859C23.6708 21.8558 23.1483 20.576 22.9306 20.0554C22.7185 19.5484 22.5031 19.617 22.3427 19.609C22.1905 19.6015 22.0162 19.5999 21.842 19.5999C21.6678 19.5999 21.3848 19.665 21.1453 19.9252C20.9058 20.1856 20.231 20.8146 20.231 22.0944C20.231 23.3742 21.1671 24.6105 21.2977 24.7841C21.4284 24.9576 23.14 27.5839 25.7608 28.7102C26.3842 28.978 26.8708 29.138 27.2502 29.2579C27.8761 29.4557 28.4457 29.4278 28.8958 29.3609C29.3978 29.2862 30.4416 28.7319 30.6593 28.1245C30.877 27.5171 30.877 26.9966 30.8117 26.8881C30.7464 26.7797 30.5722 26.7146 30.311 26.5844Z"
              fill="white"
            />
          </svg>
          </div>
         &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; 
          <div>
          <svg
            width="49"
            height="49"
            viewBox="0 0 49 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24.5" cy="24.5" r="24.5" fill="#241D5D" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.4433 18H32.5567C33.2048 18 33.5668 18.4314 33.5764 18.4314C33.8378 18.6975 34 19.0653 34 19.4698V30.5302C34 30.9347 33.8378 31.3025 33.5764 31.5686C33.5668 31.5686 33.2048 32 32.5567 32H15.4433C14.7952 32 14.4332 31.5686 14.4236 31.5686C14.1622 31.3025 14 30.9349 14 30.5302V19.4698C14 19.0653 14.1622 18.6975 14.4236 18.4314C14.4332 18.4314 14.795 18 15.4433 18ZM33.1926 19.2427L24.2418 26.6248C24.0973 26.7445 23.8929 26.7391 23.7549 26.6221L14.8074 19.2427C14.7825 19.314 14.7692 19.3903 14.7692 19.4698V30.5302C14.7692 30.7185 14.8452 30.8901 14.9675 31.0148L14.9668 31.0155C15.089 31.1397 15.2577 31.2167 15.4433 31.2167H32.5567C32.7423 31.2167 32.911 31.1395 33.0332 31.0155L33.0325 31.0148C33.1548 30.8903 33.2308 30.7185 33.2308 30.5302V19.4698C33.231 19.3903 33.2174 19.314 33.1926 19.2427ZM15.4684 18.7833L24 25.8195L32.5316 18.7833H15.4684Z"
              fill="white"
              stroke="white"
              stroke-width="0.8"
            />
          </svg>
          </div>
        </div>

        <div className="center">
          <div className="cbx-container" aria-live="polite">
            <textarea
              className="cbx-textarea"
              value={text}
              readOnly
              aria-label="Texto para copiar"
            />
            <button
              className={`cbx-copy-btn ${copied ? "cbx-copy-btn--active" : ""}`}
              onClick={handleCopy}
              title="Copiar al portapapeles"
              aria-pressed={copied}
            >
              {/* icono SVG simple (no depende de librerías externas) */}
              {copied ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 3.06667V15.8444C18 17.1733 17.1973 18.2978 16.0541 18.7322C15.8838 18.8089 15.6892 18.8344 15.5189 18.8856C15.5432 18.7322 15.5676 18.5789 15.5676 18.4256V17.3011C16.1514 17.0711 16.5405 16.5089 16.5405 15.87V3.06667C16.5405 2.22333 15.8838 1.53333 15.0811 1.53333H6.81081C6.2027 1.53333 5.64324 1.94222 5.42432 2.55556H4.37838C4.23243 2.55556 4.08649 2.58111 3.94054 2.60667C3.96487 2.42778 4.01351 2.24889 4.06216 2.07C4.45135 0.868889 5.54595 0 6.81081 0H15.0811C16.6865 0 18 1.38 18 3.06667ZM14.1081 7.15556V19.9333C14.1081 20.3933 14.0108 20.8022 13.8405 21.1856C13.3784 22.2589 12.3568 23 11.1892 23H2.91892C1.31351 23 0 21.62 0 19.9333V7.15556C0 5.90333 0.705406 4.85556 1.72703 4.37C2.09189 4.19111 2.50541 4.08889 2.91892 4.08889H11.1892C12.7946 4.08889 14.1081 5.46889 14.1081 7.15556ZM12.6486 7.15556C12.6486 6.31222 11.9919 5.62222 11.1892 5.62222H2.91892C2.11622 5.62222 1.45946 6.31222 1.45946 7.15556V19.9333C1.45946 20.7767 2.11622 21.4667 2.91892 21.4667H11.1892C11.9919 21.4667 12.6486 20.7767 12.6486 19.9333V7.15556Z" fill="#2F80ED"/>
                </svg>
              )}
            </button>
          </div>
           {textoFooter}
        </div>
      </div>
    </div>
  );
}

export default AppModal5;
