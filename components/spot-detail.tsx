"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowUpRight, Heart, Info } from "lucide-react";
import { Spot, spotSearchUrl } from "@/lib/data";
import { Art } from "./art";
import { CityMap } from "./city-map";
export function SpotDetail({ spot }: { spot: Spot }) {
  const [mode, setMode] = useState<"2D" | "3D">("3D");
  const [saved, setSaved] = useState(false);
  const visible = useMemo(() => [spot], [spot]);
  const uri = spot.position
    ? `https://uri.amap.com/navigation?to=${spot.position.join(",")},${encodeURIComponent(spot.name)}&mode=walk&coordinate=gaode&callnative=1`
    : spotSearchUrl(spot);
  return (
    <main className="detail-page">
      <Link href="/map" className="back-link">
        ← 探索武汉地图
      </Link>
      <div className="detail-hero">
        <div>
          <div className="eyebrow">{spot.en}</div>
          <h1>{spot.name}</h1>
          <p className="detail-description">{spot.description}</p>
          <div className="tags">
            <span>{spot.category}</span>
            <span>{spot.area}</span>
          </div>
          <p className="address">
            <MapPin size={17} />
            {spot.address}
          </p>
          <div className="hero-actions">
            <a href={uri} target="_blank" rel="noreferrer" className="button">
              {spot.position ? "去这里 · 高德导航" : "去高德选点导航"}{" "}
              <ArrowUpRight size={18} />
            </a>
            <button className="save-button" onClick={() => setSaved(!saved)}>
              <Heart size={18} fill={saved ? "currentColor" : "none"} />
              {saved ? "已加入本次漫游" : "想去这里"}
            </button>
          </div>
          <small className="muted">
            {spot.position
              ? "出发前请核实实际入口。"
              : "精确点位待核实，请在高德中选择具体门店或入口后导航。"}
            收藏仅在当前页面有效。
          </small>
        </div>
        <Art theme={spot.theme} />
      </div>
      <div className="detail-bottom">
        <section>
          <div className="eyebrow">BEFORE YOU GO</div>
          <h2>打卡小贴士</h2>
          <p>{spot.tip}</p>
          <div className="info-box">
            <Info size={20} />
            <p>
              留一点时间给附近的街巷，留一张照片给这段旅程。请以现场开放情况为准，尊重居民与其他游客。
            </p>
          </div>
          <Link href="/notices/travel" className="text-link">
            查看出行提醒 <ArrowUpRight size={16} />
          </Link>
        </section>
        <section id="nearby">
          <div className="heading-row">
            <h2>附近地图</h2>
            <div className="mode-switch">
              {(["2D", "3D"] as const).map((m) => (
                <button
                  key={m}
                  className={m === mode ? "active" : ""}
                  onClick={() => setMode(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="nearby-map">
            <CityMap
              visible={visible}
              selected={spot}
              onSelect={() => {}}
              mode={mode}
              nearby
            />
          </div>
          <a
            className="text-link"
            href={
              spot.position
                ? `https://uri.amap.com/marker?position=${spot.position.join(",")}&name=${encodeURIComponent(spot.name)}&coordinate=gaode&callnative=1`
                : spotSearchUrl(spot)
            }
            target="_blank"
            rel="noreferrer"
          >
            在高德查看真实周边 <ArrowUpRight size={16} />
          </a>
        </section>
      </div>
    </main>
  );
}
