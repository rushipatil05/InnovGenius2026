import React from "react";
import styles from "../../styles";
import Billing from "./Billing";
import Hero from "./Hero";
import Business from "./Business";
import CardDeal from "./CardDeal";
import Testimonials from "./Testimonials";
import Stats from "./Stats";
import Clients from "./Clients";
import CTA from "./CTA";
import Footer from "./Footer";
import Navbar from "./Navbar";
interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-primary w-full overflow-hidden">
      {/* Navbar */}
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar onSignupClick={onGetStarted} />
        </div>
      </div>

      {/* Hero */}
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Hero onGetStarted={onGetStarted} />
        </div>
      </div>

      {/* Body */}
      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Stats />
          <Business /> 
          <Billing />
          <CardDeal onSignupClick={onGetStarted} />
          <Testimonials />
          <Clients />
          <CTA onSignupClick={onGetStarted} />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;