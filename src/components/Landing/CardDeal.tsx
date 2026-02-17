import styles, { layout } from "../../styles";
import { card } from "../assets";
import Button from "./Button";

interface CardDealProps {
  onSignupClick: () => void;
}

const CardDeal: React.FC<CardDealProps> = ({ onSignupClick }) => {
  return (
    <section className={layout.section}>
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
          From Application to Activation - Powered by Intelligence.
        </h2>

        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Our conversational onboarding engine verifies identity, calculates risk in real-time, and routes applications for approval -
          ensuring fast, secure, and compliant account activation.
        </p>

        <Button
          text="Sign Up"
          className="mt-10"
          onClick={onSignupClick}
        />
      </div>

      <div className={layout.sectionImg}>
        <img
          src={card}
          alt="Card Deal"
          className="w-full h-full object-contain"
        />
      </div>
    </section>
  );
};

export default CardDeal;