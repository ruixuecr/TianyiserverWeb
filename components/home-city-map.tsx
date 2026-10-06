"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CityMap } from "./city-map";

export function HomeCityMap() {
  const router = useRouter();
  const [mode, setMode] = useState<"2D" | "3D">("3D");
  return (
    <section className="home-city-map" aria-label="武汉城市地图">
      <CityMap
        mode={mode}
        onSelect={(spot) => router.push(`/spots/${spot.id}`)}
      />
      <div className="home-map-modes mode-switch" aria-label="城市地图视角">
        {(["2D", "3D"] as const).map((value) => (
          <button
            key={value}
            className={mode === value ? "active" : ""}
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </section>
  );
}
