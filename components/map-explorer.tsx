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
  chronologicalSpots,
  spotYears,
  spotDateLabel,
  spotDateValue,
  Spot,
} from "@/lib/data";
import { CityMap } from "./city-map";
import { MapModeSwitch, type MapMode } from "./map-mode-switch";
import { Art } from "./art";
import { SpotImageCard, SpotVisual } from "./spot-image-card";
import { ThemeMotif } from "./theme-artwork";
export function MapExplorer() {
  const [year, setYear] = useState("全部地点");
  const [selected, setSelected] = useState<Spot>();
  const [zoom, setZoom] = useState(0);
  const [reset, setReset] = useState(0);
  const [mode, setMode] = useState<MapMode>("3D");
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
        <h1>打卡推荐</h1>
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
          {visible.length} 个地点 <span>武汉 · WUHAN</span>
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
              {s.memoryDate.additionalMonths?.length ? (
                <div className="location-date">{spotDateLabel(s)}</div>
              ) : (
                <time className="location-date" dateTime={spotDateValue(s)}>
                  {spotDateLabel(s)}
                </time>
              )}
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
        </div>
      </aside>
      <section className="map-canvas">
        <CityMap
          mode={mode}
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
          <MapModeSwitch mode={mode} onChange={setMode} />
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
