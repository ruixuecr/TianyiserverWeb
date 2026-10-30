"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Search,
  ShoppingBag,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { recommendations } from "@/lib/recommendations";
import { placeSearchUrl } from "@/lib/activities";

const filters = ["全部推荐", "美食", "商场"] as const;
export function RecommendationExplorer() {
  const [kind, setKind] = useState<(typeof filters)[number]>("全部推荐");
  const [query, setQuery] = useState("");
  const visible = recommendations.filter(
    (place) =>
      (kind === "全部推荐" || place.kind === kind) &&
      `${place.name}${place.district ?? ""}${place.area ?? ""}${place.tags.join("")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="recommendation-tools">
        <div
          className="recommendation-filters"
          role="group"
          aria-label="推荐类别"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              className={kind === filter ? "active" : ""}
              aria-pressed={kind === filter}
              onClick={() => setKind(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <label className="recommendation-search">
          <Search size={17} />
          <input
            aria-label="搜索美食或商场"
            placeholder="搜索名称、区域或关键词"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button aria-label="清空推荐搜索" onClick={() => setQuery("")}>
              <X size={16} />
            </button>
          )}
        </label>
      </div>
      <p className="recommendation-count" role="status">
        找到 {visible.length} 个吃逛去处
      </p>
      <div className="recommendation-grid">
        {visible.map((place) => {
          const Icon = place.kind === "美食" ? UtensilsCrossed : ShoppingBag;
          return (
            <article
              className={`recommendation-card ${place.kind === "美食" ? "recommendation-food" : "recommendation-shopping"}`}
              key={place.id}
            >
              <div className="recommendation-card-top">
                <span className="recommendation-icon">
                  <Icon size={29} strokeWidth={1.2} />
                </span>
                <span className="recommendation-kind">{place.kind}</span>
              </div>
              <h2>{place.name}</h2>
              {(place.district || place.area) && (
                <p className="recommendation-address">
                  <MapPin size={13} />
                  {[place.district, place.area].filter(Boolean).join(" · ")}
                </p>
              )}
              {place.tags.length > 0 && (
                <div className="recommendation-tags">
                  {place.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
              <div className="recommendation-actions">
                <a
                  href={placeSearchUrl(place.mapQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="community-link"
                  aria-label={`在高德查看${place.name}（新窗口）`}
                >
                  高德查看位置 <ArrowUpRight size={16} />
                </a>
                {place.spotId && (
                  <Link
                    href={`/spots/${place.spotId}`}
                    className="community-link"
                  >
                    打卡攻略 <ArrowUpRight size={16} />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!visible.length && (
        <div className="recommendation-empty">
          <Search size={32} strokeWidth={1} />
          <h2>还没有找到这个去处</h2>
          <p>换一个名称或区域试试。</p>
          <button
            className="button"
            onClick={() => {
              setKind("全部推荐");
              setQuery("");
            }}
          >
            查看全部推荐
          </button>
        </div>
      )}
    </>
  );
}
