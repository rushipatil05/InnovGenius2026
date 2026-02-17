import React from "react";
import { apple, bill, google,meter } from "../assets";
import styles, { layout } from "../../styles";

const Billing: React.FC = () => {
  return (
    <section id="product" className={layout.sectionReverse}>
      <div className={layout.sectionImgReverse}>
        <img
          src={bill}
          alt="Billing"
          className="w-[100%] h-[100%] relative z-[5]"
        />

        <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
        <div className="absolute z-[0] -left-1/2 bottom-0 w-[50%] h-[50%] rounded-full pink__gradient" />
      </div>

      {/* Right Side */}
      <div className={layout.sectionInfo}>
        {/* Info */}
        <h2 className={styles.heading2}>
          Complete Control Over 
          <br className="sm:block hidden" /> Risk & Compliance.
        </h2>

        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Monitor applications, review risk explanations, approve or reject accounts, 
          and track every action with a fully auditable compliance system.
        </p>

      </div>
    </section>
  );
};

export default Billing;