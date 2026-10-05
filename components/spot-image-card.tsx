"use client";

import { useState } from "react";
import { Spot, SpotImage } from "@/lib/data";
import { Art } from "./art";

export function SpotVisual({
  image,
  spot,
  className,
}: {
  image?: SpotImage;
  spot: Spot;
  className: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  return (
    <div className={className}>
      {image && image.src !== failedSrc ? (
        <img
          src={image.src}
          alt={image.alt}
          onError={() => setFailedSrc(image.src)}
        />
      ) : (
        <div
          role="img"
          aria-label={`${spot.name}示意插画`}
          className="spot-art-fallback"
        >
          <Art theme={spot.theme} />
        </div>
      )}
    </div>
  );
}

export function SpotImageCard({ spot }: { spot: Spot }) {
  return (
    <figure className="spot-image-card" aria-label={`${spot.name}独立图片卡片`}>
      <SpotVisual
        image={spot.featuredImage}
        spot={spot}
        className="spot-featured-image"
      />
      <figcaption>
        <span>{spot.featuredImage ? "地点影像" : "地点插画"}</span>
        <span>{spot.name}</span>
      </figcaption>
    </figure>
  );
}
