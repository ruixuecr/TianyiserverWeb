"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Plus,
  Minus,
  LocateFixed,
  MapPin,
  Compass,
  X,
} from "lucide-react";
import {
  spots,
  chronologicalSpots,
  spotYears,
  spotDateLabel,
  spotDateValue,
  Spot,
} from "@/lib/data";
import { CityMap } from "./city-map";
import { Art } from "./art";
import { SpotImageCard, SpotVisual } from "./spot-image-card";
import { ThemeMotif } from "./theme-artwork";
export function MapExplorer() {
  const [year, setYear] = useState("全部地点");
  const [selected, setSelected] = useState<Spot>();
  const [zoom, setZoom] = useState(0);
  const [reset, setReset] = useState(0);
  const visible = useMemo(
    () =>
      chronologicalSpots.filter(
        (s) => year === "全部地点" || String(s.memoryDate.year) === year,
      ),
    [year],
  );
  function changeYear(value: string) {
    setYear(value);
    setSelected(undefined);
  }
  return (
    <main className="explorer">
      <aside className="map-sidebar">
        <Link href="/" className="back-link">
          ← 回到首页
        </Link>
        <div className="eyebrow">WUHAN CITY EXPLORER</div>
        <h1>下一站，去哪里？</h1>
        <p>把江城的风景，装进你的行程。</p>
        <div className="filters" role="group" aria-label="按年份筛选地点">
          {["全部地点", ...spotYears.map(String)].map((value) => (
            <button
              key={value}
              className={year === value ? "active" : ""}
              aria-pressed={year === value}
              onClick={() => changeYear(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="list-caption">
          发现 {visible.length} 个好地方 <span>武汉 · WUHAN</span>
        </div>
        <div className="location-list">
          {visible.map((s) => (
            <button
              key={s.id}
              className={`location-row ${selected?.id === s.id ? "selected" : ""}`}
              onClick={() => setSelected(s)}
            >
              <div className="location-thumb">
                <Art theme={s.theme} />
              </div>
              <div>
                <h3>{s.name}</h3>
                <p>
                  {s.area} · {s.category}
                </p>
              </div>
              <time className="location-date" dateTime={spotDateValue(s)}>
                {spotDateLabel(s)}
              </time>
            </button>
          ))}
          {visible.length === 0 && (
            <div className="empty">
              这一年暂无地点。
              <button onClick={() => changeYear("全部地点")}>
                查看全部地点
              </button>
            </div>
          )}
        </div>
        <div className="sidebar-note">
          <ThemeMotif kind="ribbon" />
          <span>
            不赶路，去感受路。<small>{spots.length} 个精选地点，慢慢逛。</small>
          </span>
        </div>
      </aside>
      <section className="map-canvas">
        <CityMap
          visible={visible}
          selected={selected}
          onSelect={setSelected}
          onDeselect={() => setSelected(undefined)}
          zoomAction={zoom}
          resetAction={reset}
        />
        <div className="map-top">
          <span>
            <span className="status-dot" /> 武汉城市漫游
          </span>
          <span>3D 俯瞰</span>
        </div>
        <div className="map-compass">
          N<Compass size={32} />
        </div>
        <div className="map-controls">
          <button
            title="放大"
            aria-label="放大"
            onClick={() => setZoom((z) => z + 1)}
          >
            <Plus />
          </button>
          <button
            title="缩小"
            aria-label="缩小"
            onClick={() => setZoom((z) => z - 1)}
          >
            <Minus />
          </button>
          <button
            title="查看全城"
            aria-label="查看全城"
            onClick={() => {
              setSelected(undefined);
              setReset((r) => r + 1);
            }}
          >
            <LocateFixed />
          </button>
        </div>
        {selected && (
          <div className="selected-preview" key={selected.id}>
            <SpotImageCard spot={selected} />
            <div className="selected-card">
              <SpotVisual
                image={selected.thumbnail}
                spot={selected}
                className="selected-thumbnail"
                sizes="(max-width: 700px) 78px, 100px"
              />
              <div>
                <span className="eyebrow">{selected.category}</span>
                <h2>{selected.name}</h2>
                <p>
                  <MapPin size={13} />
                  {selected.area}
                </p>
                <Link href={`/spots/${selected.id}`} className="text-link">
                  查看打卡攻略 <ArrowUpRight size={18} />
                </Link>
              </div>
              <button
                className="close-card"
                aria-label="关闭地点预览"
                onClick={() => setSelected(undefined)}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
        <span className="map-bottom-note">
          好风景，都在路上。 / EXPLORE WUHAN
        </span>
      </section>
    </main>
  );
}
