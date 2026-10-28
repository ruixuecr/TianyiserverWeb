"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import type { ActivityMedia } from "@/lib/activities";

export function ActivityImage({
  image,
  sizes,
  qr = false,
}: {
  image: ActivityMedia;
  sizes: string;
  qr?: boolean;
}) {
  const [failed, setFailed] = useState<string>();
  if (failed === image.src)
    return (
      <div
        className="media-placeholder"
        role="img"
        aria-label={`${image.alt}暂时无法加载`}
      >
        <ImageIcon size={30} />
        <span>图片暂时无法加载</span>
        <button onClick={() => setFailed(undefined)}>重新加载</button>
      </div>
    );
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      unoptimized={qr}
      onError={() => setFailed(image.src)}
    />
  );
}
