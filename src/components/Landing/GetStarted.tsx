import React from "react";
import styles from "../../styles";
import { arrowUp } from "../assets";

interface GetStartedProps {
  onClick: () => void;
}

const GetStarted: React.FC<GetStartedProps> = ({ onClick }) => {
  return (
    <button
        onClick={onClick}
      className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-blue-gradient p-[2px] cursor-pointer`}
    >
      <div
        className={`${styles.flexCenter} flex-col bg-primary hover:bg-opacity-95 w-full h-full rounded-full`}
      >
        <div className={`${styles.flexStart} flex-row`}>
          <p className="font-poppins font-medium text-[18px] leading-[23px] mr-2">
            <span className="text-gradient">Get</span>
          </p>

          {/* Arrow Image */}
          <img
            src={arrowUp}
            alt="Arrow Up"
            className="w-[23px] h-[23px] object-contain"
          />
        </div>

        <p className="font-poppins font-medium text-[18px] leading-[23px]">
          <span className="text-gradient">Started </span>
        </p>
      </div>
    </button>
  );
};

export default GetStarted;