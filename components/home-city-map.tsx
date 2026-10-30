"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CityMap } from "./city-map";
import { MapModeSwitch, type MapMode } from "./map-mode-switch";
export function HomeCityMap() {
  const router = useRouter();
  const [mode, setMode] = useState<MapMode>("3D");
  return (
    <section className="home-city-map" aria-label="武汉城市地图">
      <CityMap mode={mode} onSelect={(spot) => router.push(`/spots/${spot.id}`)} />
      <div className="home-map-modes">
        <MapModeSwitch mode={mode} onChange={setMode} />
      </div>
    </section>
  );
}
