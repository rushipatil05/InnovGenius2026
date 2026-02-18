import React, { useRef, useMemo } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import * as topojson from "topojson-client";
import landTopology from "../assets/land_10m.json";
import pointsDataRaw from "../assets/random-locations.json";
import { FeatureCollection } from "geojson";

/* -------------------- Types -------------------- */

interface PointData {
  lat: number;
  lng: number;
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  time: number;
  color: string[];
}

/* -------------------- Data Prep -------------------- */

const pointsData: PointData[] = pointsDataRaw as unknown as PointData[];

const min = 1000;
const max = 4000;

const sliceData = [...pointsData]
  .sort(() => (Math.random() > 0.5 ? 1 : -1))
  .slice(20, 90);

const arcsData: ArcData[] = sliceData.map(() => {
  const randStart = Math.floor(Math.random() * sliceData.length);
  const randEnd = Math.floor(Math.random() * sliceData.length);
  const randTime = Math.floor(Math.random() * (max - min + 1) + min);

  return {
    startLat: sliceData[randStart].lat,
    startLng: sliceData[randStart].lng,
    endLat: sliceData[randEnd].lat,
    endLng: sliceData[randEnd].lng,
    time: randTime,
    color: ["#ffffff00", "#faf7e6", "#ffffff00"],
  };
});

/* -------------------- Component -------------------- */

const Page: React.FC = () => {
  const globeRef = useRef<any>(null);

  const landPolygons = useMemo(() => {
    const topology = landTopology as any;

    const geoJson = topojson.feature(
      topology,
      topology.objects.land
    ) as any;

    return geoJson.features;
  }, []);

  const globeReady = () => {
    if (!globeRef.current) return;

    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = 0.6;
    globeRef.current.controls().enableZoom = false;

    globeRef.current.pointOfView({
      lat: 20,
      lng: 0,
      altitude: 1.8,
    });
  };

  return (
    <div className="flex justify-center ">
      <Globe
        ref={globeRef}
        width={550}
        height={550}
        onGlobeReady={globeReady}
        backgroundColor="rgba(0,0,0,0)"
        rendererConfig={{ alpha: true, antialias: true }}

        /* 🌊 Ocean */
        globeMaterial={
          new THREE.MeshPhongMaterial({
            color: "#0b1e2d",
            shininess: 5,
          })
        }

        /* ☁ Atmosphere */
        atmosphereColor="#00c3ff"
        atmosphereAltitude={0.18}

        /* 🌍 GREEN LAND */
        polygonsData={landPolygons}
        polygonCapColor={() => "#2ecc71"}
        polygonSideColor={() => "#1e8449"}
        polygonStrokeColor={() => "rgba(0,0,0,0.2)"}
        polygonAltitude={0.01}

        /* 📍 Points */
        pointsData={pointsData}
        pointAltitude={0.01}
        pointRadius={0.2}
        pointColor={() => "#eed31f"}

        /* ✈ Arcs */
        arcsData={arcsData}
        arcAltitudeAutoScale={0.3}
        arcColor="color"
        arcStroke={0.5}
        arcDashGap={2}
        arcDashAnimateTime="time"
      />
    </div>
  );
};

export default Page;