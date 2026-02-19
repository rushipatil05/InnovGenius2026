import React from "react";
import styles from "../../styles";
import { discount, robot } from "../assets";
import GetStarted from "./GetStarted";
import HeroCard from "./HeroCard";
import { motion } from "framer-motion";
interface HeroProps {
  onGetStarted: () => void;
}
const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col`}
    >
      {/* Left Side */}
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
      >
        {/* Discount Promo */}
        <div className="flex flex-row items-center py-[1px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <img
            src={discount}
            alt="Discount"
            className="w-[32px] h-[32px]"
          />
          <p className={`${styles.paragraph} ml-2`}>
             Open Your <span className="text-white">Savings Account</span> in Minutes — {" "}
            <span className="text-white">Powered by AI</span>
          </p>
        </div>

        {/* Heading */}
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100px] leading-[75px]">
            The Next <br className="sm:block hidden" />{" "}
            <span className="text-gradient">Generation</span>
          </h1>

          <div className="ss:flex hidden md:mr-4 mr-0">
            <GetStarted onClick={onGetStarted} />
          </div>
        </div>

        <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100px] leading-[75px] w-full">
          Smarter Banking.
        </h1>

        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Our team of experts uses a methodology to identify the credit cards
          most likely to fit your needs. We examine annual percentage rates,
          annual fees.
        </p>
      </div>

      {/* Right Side */}
      {/* Right Side */}
      <div
        className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}
      >
        {/* Robot */}
        <img
          src={robot}
          alt="Robot Illustration"
          className="w-[100%] h-[100%] relative z-[1]"
        />
        <div className="absolute bottom-[27%] right-[15%] z-[10] perspective-[1000px]">
          <motion.div
            initial={{
              opacity: 0,
              x: 100,
              rotateY: 45,
              rotateX: 10,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              x: 0,
              rotateY: 0,
              rotateX: 0,
              scale: 1,
            }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex justify-center md:justify-end mt-16 md:mt-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            <HeroCard />
          </motion.div>
        </div>

        {/* Gradient Effects */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[0] w-[80%] h-[80%] rounded-full bottom-40 white__gradient" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        <GetStarted onClick={onGetStarted} />
      </div>
    </section>
  );
};

export default Hero;