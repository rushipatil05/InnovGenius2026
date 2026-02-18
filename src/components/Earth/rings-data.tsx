import React from "react";
import Globe from "react-globe.gl";
import hexRgb from "hex-rgb";
import globeImage from "../assets/earth-dark.jpg";

interface RingData {
  lat: number;
  lng: number;
  radius: number;
  color: string;
  speed: number;
  repeat: number;
}

const Page: React.FC = () => {
  const myData: RingData[] = [
    {
      lat: 29.953204744601763,
      lng: -90.08925929478903,
      radius: 20,
      color: "#00ff33",
      speed: 10,
      repeat: 500,
    },
    {
      lat: 28.621322361013092,
      lng: 77.20347613099612,
      radius: 40,
      color: "#ffff00",
      speed: 20,
      repeat: 500,
    },
    {
      lat: -43.1571459086602,
      lng: 172.72338919659848,
      radius: 5,
      color: "#ff0000",
      speed: 2,
      repeat: 1000,
    },
  ];

  return (
    <div className="cursor-move">
      <Globe
        globeImageUrl={globeImage}
        ringsData={myData}
        ringMaxRadius="radius"
        ringColor={(ring: object) => {
          const data = ring as RingData;

          return (time: number): string => {
            const { red, green, blue } = hexRgb(data.color);
            return `rgba(${red},${green},${blue},${Math.sqrt(
              1 - time
            )})`;
          };
        }}
        ringPropagationSpeed="speed"
        ringRepeatPeriod="repeat"
      />
    </div>
  );
};

export default Page;