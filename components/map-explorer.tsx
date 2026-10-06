"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Plus,
  Minus,
  LocateFixed,
  MapPin,
  Compass,
  X,
} from "lucide-react";
import { spots, categories, Spot } from "@/lib/data";
import { CityMap } from "./city-map";
import { Art } from "./art";
import { SpotImageCard, SpotVisual } from "./spot-image-card";
export function MapExplorer() {
  const [category, setCategory] = useState("全部地点");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Spot>();
  const [zoom, setZoom] = useState(0);
  const [reset, setReset] = useState(0);
  const visible = useMemo(
    () =>
      spots.filter(
        (s) =>
          (category === "全部地点" || s.category === category) &&
          `${s.name}${s.area}${s.address}${s.searchName || ""}`.includes(
            query.trim(),
          ),
      ),
    [category, query],
  );
  function changeCategory(c: string) {
    setCategory(c);
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
        <label className="search">
          <Search size={18} />
          <input
            aria-label="搜索地点"
            placeholder="搜索地点、区域…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(undefined);
            }}
          />
          {query && (
            <button aria-label="清空搜索" onClick={() => setQuery("")}>
              <X size={16} />
            </button>
          )}
        </label>
        <div className="filters">
          {categories.map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              onClick={() => changeCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="list-caption">
          发现 {visible.length} 个好地方 <span>武汉 · WUHAN</span>
        </div>
        <div className="location-list">
          {visible.map((s, i) => (
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
              <span>{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
          {visible.length === 0 && (
            <div className="empty">
              没有找到这个地点。
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("全部地点");
                }}
              >
                查看全部地点
              </button>
            </div>
          )}
        </div>
        <div className="sidebar-note">
          <Compass size={18} />
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
