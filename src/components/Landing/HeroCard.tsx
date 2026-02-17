"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

export default function HeroCard() {
  const containerRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const translateZ = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, { stiffness: 150, damping: 18 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 150, damping: 18 });
  const smoothZ = useSpring(translateZ, { stiffness: 120, damping: 20 });

  const { scrollY } = useScroll();
  const depth = useTransform(scrollY, [0, 600], [0, -120]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.06]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / width) - 0.5;
    const percentY = (y / height) - 0.5;

    const intensity = 10;

    // Side lift effect
    rotateY.set(percentX * intensity);
    rotateX.set(-percentY * intensity);

    // Subtle pop-out when hovering near edges
    translateZ.set(30);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    translateZ.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        y: depth,
        scale,
        z: smoothZ,
        transformPerspective: 1600,
        transformStyle: "preserve-3d",
      }}
      className="relative w-[460px] h-[280px] cursor-pointer"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full h-full rounded-2xl
                   bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#000000]
                   shadow-[0_80px_160px_rgba(0,0,0,0.75)]
                   overflow-hidden"
      >
        <CardDetails />
      </motion.div>
    </motion.div>
  );
}

function CardDetails() {
  return (
    <div className="relative w-full h-full p-6 text-white">
      <div className="w-14 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-md mb-6" />

      <div className="tracking-[0.3em] text-lg font-light mb-6">
        1234 5678 9012 3456
      </div>

      <div className="flex justify-between items-end text-sm">
        <div>
          <p className="text-white/60 text-xs">Card Holder</p>
          <p className="text-base font-medium">User420</p>
        </div>

        <div className="text-right">
          <p className="text-white/60 text-xs">Expires</p>
          <p className="text-base font-medium">12/30</p>
        </div>
      </div>

      <div className="absolute top-6 right-6 text-xl font-bold tracking-wide">
        VISA
      </div>
    </div>
  );
}