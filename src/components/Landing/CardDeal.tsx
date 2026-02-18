import { Routes, Route } from "react-router-dom";
import styles, { layout } from "../../styles";
import { card } from "../assets";
import Button from "./Button";
// Route Pages
import Finished from "../Earth/finished";
import BasicImage from "../Earth/basic-image";
import GeojsonPolygon from "../Earth/geojson-polygon";
import GeojsonHexagon from "../Earth/geojson-hexagon";
import ArcsData from "../Earth/arcs-data";
import RingsData from "../Earth/rings-data";
import HTMLMarker from "../Earth/html-marker";
import CustomLayer from "../Earth/custom-layer";
import NotFound from "../Earth/not-found";

interface CardDealProps {
  onSignupClick: () => void;
}

const CardDeal: React.FC<CardDealProps> = ({ onSignupClick }) => {
  return (
    <main>
      {/* Existing Card Section */}
      <section className={layout.section}>
        <div className={layout.sectionInfo}>
          <h2 className={styles.heading2}>
            From Application to Activation - Powered by Intelligence.
          </h2>

          <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
            Our conversational onboarding engine verifies identity,
            calculates risk in real-time, and routes applications for
            approval - ensuring fast, secure, and compliant account activation.
          </p>

          <Button
            text="Sign Up"
            className="mt-10"
            onClick={onSignupClick}
          />
        </div>

        <div className={`${layout.sectionImg} h-[500px]`}>
          <div className="w-full h-full">
            <Finished />
          </div>
        </div>
      </section>

      {/* Earth Routes Section */}
      {/* <Routes>
        <Route path="/" element={<Finished />} />
        <Route path="/basic-image" element={<BasicImage />} />
        <Route path="/geojson-polygon" element={<GeojsonPolygon />} />
        <Route path="/geojson-hexagon" element={<GeojsonHexagon />} />
        <Route path="/arcs-data" element={<ArcsData />} />
        <Route path="/rings-data" element={<RingsData />} />
        <Route path="/html-marker" element={<HTMLMarker />} />
        <Route path="/custom-layer" element={<CustomLayer />} />
        <Route path="*" element={<NotFound />} />
      </Routes> */}
    </main>
  );
};

export default CardDeal;