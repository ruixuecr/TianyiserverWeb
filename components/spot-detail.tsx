"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { Spot, spotSearchUrl } from "@/lib/data";
import { CityMap } from "./city-map";

export function SpotDetail({ spot }: { spot: Spot }) {
  const [failedImage, setFailedImage] = useState<string>();
  const visible = useMemo(() => [spot], [spot]);
  const uri = spot.position
    ? `https://uri.amap.com/navigation?to=${spot.position.join(",")},${encodeURIComponent(spot.name)}&mode=walk&coordinate=gaode&callnative=1`
    : spotSearchUrl(spot);
  return (
    <main className="detail-page spot-layout">
      <Link href="/map" className="back-link">
        ← 探索武汉地图
      </Link>
      <div className="spot-overview">
        <section className="spot-map-section" aria-label="地点地图">
          <div className="spot-map-toolbar">
            <span>地点地图</span>
            <span>3D 俯瞰</span>
          </div>
          <div className="nearby-map spot-navigation-map">
            <div className="spot-map-preview" aria-hidden="true" inert>
              <CityMap
                visible={visible}
                selected={spot}
                onSelect={() => {}}
                nearby
              />
            </div>
            <a
              className="spot-map-link"
              href={uri}
              target="_blank"
              rel="noreferrer"
              aria-label={`点击地图，在高德${spot.position ? "导航至" : "选点导航至"}${spot.name}（新窗口）`}
            >
              <span>
                点击地图 · {spot.position ? "高德导航" : "高德选点导航"}
                <ArrowUpRight size={16} />
              </span>
            </a>
          </div>
        </section>
        <section className="spot-introduction">
          <h1>{spot.name}</h1>
          <p>{spot.description}</p>
        </section>
      </div>
      <section className="spot-photo-area" aria-label={`${spot.name}图片展示`}>
        {spot.featuredImage && failedImage !== spot.featuredImage.src ? (
          <img
            src={spot.featuredImage.src}
            alt={spot.featuredImage.alt}
            onError={() => setFailedImage(spot.featuredImage?.src)}
          />
        ) : (
          <div className="spot-photo-placeholder">
            <ImageIcon size={32} strokeWidth={1} />
            <span>地点图片 · 敬请期待</span>
          </div>
        )}
      </section>
    </main>
  );
}
