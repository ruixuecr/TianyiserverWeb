"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { Spot, SpotImage, spotSearchUrl } from "@/lib/data";
import { CityMap } from "./city-map";
import { MapModeSwitch, type MapMode } from "./map-mode-switch";

export function SpotDetail({ spot }: { spot: Spot }) {
  const [mode, setMode] = useState<MapMode>("3D");
  const visible = useMemo(() => [spot], [spot]);
  const images = [
    ...(spot.featuredImage ? [spot.featuredImage] : []),
    ...(spot.detailImages ?? []),
  ];
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
            <MapModeSwitch mode={mode} onChange={setMode} />
          </div>
          <div className="nearby-map spot-navigation-map">
            <div className="spot-map-preview" aria-hidden="true" inert>
              <CityMap
                mode={mode}
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
          {spot.description?.split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      </div>
      {images.length ? (
        images.map((image) => (
          <DetailImage key={image.src} image={image} name={spot.name} />
        ))
      ) : (
        <DetailImage name={spot.name} />
      )}
    </main>
  );
}

function DetailImage({ image, name }: { image?: SpotImage; name: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <section className="spot-photo-area" aria-label={image?.alt ?? `${name}图片展示`}>
      {image && !failed ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 700px) calc(100vw - 44px), (max-width: 1312px) calc(100vw - 80px), 1232px"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="spot-photo-placeholder">
          <ImageIcon size={32} strokeWidth={1} />
          <span>地点图片 · 敬请期待</span>
        </div>
      )}
    </section>
  );
}
