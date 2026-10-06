"use client";
import { useRouter } from "next/navigation";
import { CityMap } from "./city-map";
export function HomeCityMap() {
  const router = useRouter();
  return (
    <section className="home-city-map" aria-label="武汉城市地图">
      <CityMap onSelect={(spot) => router.push(`/spots/${spot.id}`)} />
    </section>
  );
}
