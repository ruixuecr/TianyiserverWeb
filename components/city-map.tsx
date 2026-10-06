"use client";
import { useEffect, useRef, useState } from "react";
import { Spot, spots } from "@/lib/data";

type Marker = { setContent: (content: HTMLElement) => void };
type Boundary = { lng: number; lat: number }[][];
type Outline = object;
type MapInstance = {
  destroy: () => void;
  add: (markers: (Marker | Outline)[]) => void;
  setFitView: (
    overlays: Outline[],
    immediately: boolean,
    padding: number[],
  ) => void;
  setZoomAndCenter: (zoom: number, center: number[]) => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number;
  getCenter: () => { lng: number; lat: number };
  addControl: (control: unknown) => void;
  on: (event: string, handler: () => void) => void;
};
type Poi = {
  id: string;
  name: string;
  address?: string;
  adname?: string;
  location?: { lng: number; lat: number };
};
type AmapSDK = {
  Map: new (el: HTMLElement, options: Record<string, unknown>) => MapInstance;
  Marker: new (options: Record<string, unknown>) => Marker;
  Scale: new () => unknown;
  Polygon: new (options: Record<string, unknown>) => Outline;
  DistrictSearch: new (options: Record<string, unknown>) => {
    search: (
      code: string,
      callback: (
        status: string,
        result: { districtList?: { adcode: string; boundaries?: Boundary }[] },
      ) => void,
    ) => void;
  };
  PlaceSearch: new (options: Record<string, unknown>) => {
    search: (
      keyword: string,
      callback: (
        status: string,
        result: { poiList?: { pois?: Poi[] } },
      ) => void,
    ) => void;
  };
};
declare global {
  interface Window {
    AMap?: AmapSDK;
    _AMapSecurityConfig?: { serviceHost: string };
  }
}
let sdkPromise: Promise<AmapSDK> | null = null;
function loadMap() {
  if (window.AMap?.PlaceSearch && window.AMap?.DistrictSearch)
    return Promise.resolve(window.AMap);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<AmapSDK>((resolve, reject) => {
    window._AMapSecurityConfig = {
      serviceHost: window.location.origin + "/_AMapService",
    };
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(process.env.NEXT_PUBLIC_AMAP_KEY || "")}&plugin=AMap.Scale,AMap.PlaceSearch,AMap.DistrictSearch`;
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      reject(new Error("高德地图加载失败，请检查网络和 Key 配置"));
    };
    const timer = setTimeout(fail, 15000);
    script.onload = () => {
      clearTimeout(timer);
      window.AMap?.PlaceSearch && window.AMap?.DistrictSearch
        ? resolve(window.AMap)
        : fail();
    };
    script.onerror = fail;
    document.head.appendChild(script);
  }).catch((error) => {
    sdkPromise = null;
    throw error;
  });
  return sdkPromise;
}
let boundaryPromise: Promise<Boundary> | null = null;
function loadWuhanBoundary(sdk: AmapSDK): Promise<Boundary> {
  if (boundaryPromise) return boundaryPromise;
  boundaryPromise = new Promise<Boundary>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("武汉边界加载超时，请重试")),
      12000,
    );
    new sdk.DistrictSearch({
      level: "city",
      subdistrict: 0,
      extensions: "all",
    }).search("420100", (status, result) => {
      clearTimeout(timer);
      const district = result.districtList?.find(
        (item) => String(item.adcode) === "420100",
      );
      const bounds = district?.boundaries;
      if (
        status !== "complete" ||
        !bounds?.length ||
        bounds.some((ring) => ring.length < 3)
      ) {
        reject(new Error("武汉行政区边界暂不可用，请重试"));
        return;
      }
      resolve(bounds);
    });
  }).catch((error) => {
    boundaryPromise = null;
    throw error;
  });
  return boundaryPromise;
}
const poiCache = new Map<string, Promise<Spot | null>>();
const normalize = (name: string) =>
  name.replace(/^武汉市?/, "").replace(/[\s（）()··・-]/g, "");
function resolveSpot(sdk: AmapSDK, spot: Spot): Promise<Spot | null> {
  if (spot.position) return Promise.resolve(spot);
  if (spot.locationPending) return Promise.resolve(null);
  const query = spot.searchName || spot.name;
  if (poiCache.has(query)) return poiCache.get(query)!;
  const promise = new Promise<Spot | null>((resolve) => {
    const timer = setTimeout(() => {
      poiCache.delete(query);
      resolve(null);
    }, 12000);
    new sdk.PlaceSearch({
      city: "420100",
      citylimit: true,
      pageSize: 25,
      pageIndex: 1,
      extensions: "base",
    }).search(query, (status, result) => {
      clearTimeout(timer);
      const matches =
        status === "complete"
          ? (result.poiList?.pois || []).filter(
              (poi) =>
                normalize(poi.name) === normalize(query) &&
                poi.location &&
                Number.isFinite(poi.location.lng) &&
                Number.isFinite(poi.location.lat),
            )
          : [];
      // Never take the first fuzzy result: multiple matches need explicit confirmation.
      if (matches.length !== 1) {
        poiCache.delete(query);
        resolve(null);
        return;
      }
      const poi = matches[0];
      resolve({
        ...spot,
        position: [poi.location!.lng, poi.location!.lat],
        address:
          typeof poi.address === "string" && poi.address
            ? poi.address
            : spot.address,
        area: poi.adname || spot.area,
      });
    });
  });
  poiCache.set(query, promise);
  return promise;
}
export function CityMap({
  visible = spots,
  selected,
  onSelect,
  onDeselect,
  zoomAction = 0,
  resetAction = 0,
  nearby = false,
}: {
  visible?: Spot[];
  selected?: Spot;
  onSelect: (spot: Spot) => void;
  onDeselect?: () => void;
  zoomAction?: number;
  resetAction?: number;
  nearby?: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const instance = useRef<MapInstance | null>(null);
  const outlines = useRef<Outline[]>([]);
  const callbacks = useRef({ onSelect, onDeselect, selected });
  callbacks.current = { onSelect, onDeselect, selected };
  const resolved = useRef(new Map<string, Spot>());
  const markers = useRef<{ marker: Marker; spot: Spot }[]>([]);
  const camera = useRef<{ center: number[]; zoom: number } | null>(null);
  const [status, setStatus] = useState<
    "loading" | "live" | "error" | "unconfigured"
  >(process.env.NEXT_PUBLIC_AMAP_KEY ? "loading" : "unconfigured");
  const [missing, setMissing] = useState<string[]>([]);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  function markerContent(spot: Spot) {
    const button = document.createElement("button");
    button.className = `map-marker amap-spot-marker ${callbacks.current.selected?.id === spot.id ? "selected" : ""}`;
    button.setAttribute("aria-label", spot.name);
    button.setAttribute(
      "aria-pressed",
      String(callbacks.current.selected?.id === spot.id),
    );
    const dot = document.createElement("span");
    dot.textContent = spot.category === "演出场馆" ? "♫" : "●";
    const name = document.createElement("b");
    name.textContent = spot.name;
    button.append(dot, name);
    button.onclick = (event) => {
      event.stopPropagation();
      callbacks.current.onSelect(spot);
    };
    return button;
  }
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_AMAP_KEY || !el.current) return;
    let cancelled = false;
    let renderTimer: ReturnType<typeof setTimeout> | undefined;
    let map: MapInstance | null = null;
    setStatus("loading");
    setMissing([]);
    loadMap()
      .then(async (sdk) => {
        if (cancelled || !el.current) return;
        const boundaries = await loadWuhanBoundary(sdk);
        if (cancelled || !el.current) return;
        map = new sdk.Map(el.current, {
          viewMode: "3D",
          mask: boundaries.map((ring) => [ring]),
          pitch: 52,
          pitchEnable: false,
          rotation: -18,
          zoom: camera.current?.zoom || 11,
          center: camera.current?.center || [114.305, 30.56],
          mapStyle: "amap://styles/7444edd6e8d1980b3cb81eb2e28dc88a",
          showBuildingBlock: true,
          resizeEnable: true,
        });
        instance.current = map;
        map.on("click", () => callbacks.current.onDeselect?.());
        renderTimer = setTimeout(() => {
          if (!cancelled) {
            setError("地图加载超时，请检查网络后重试");
            setStatus("error");
          }
        }, 15000);
        map.on("complete", () => {
          clearTimeout(renderTimer);
          if (!cancelled) setStatus("live");
        });
        map.on("error", () => {
          clearTimeout(renderTimer);
          if (!cancelled) {
            setError("地图服务暂不可用，请稍后重试");
            setStatus("error");
          }
        });
        map.addControl(new sdk.Scale());
        outlines.current = boundaries.map(
          (path) =>
            new sdk.Polygon({
              path,
              strokeColor: "#527054",
              strokeWeight: 2,
              strokeOpacity: 0.9,
              fillOpacity: 0,
              bubble: true,
              zIndex: 10,
            }),
        );
        map.add(outlines.current);
        // Keep the initial urban view; fitting the full boundary zooms out too far.
        const results = await Promise.all(
          visible.map((spot) => resolveSpot(sdk, spot)),
        );
        if (cancelled) return;
        resolved.current = new Map(
          results.filter((s): s is Spot => !!s).map((s) => [s.id, s]),
        );
        setMissing(visible.filter((_, i) => !results[i]).map((s) => s.name));
        markers.current = [...resolved.current.values()].map((spot) => ({
          spot,
          marker: new sdk.Marker({
            position: spot.position,
            content: markerContent(spot),
            anchor: "bottom-center",
            bubble: false,
          }),
        }));
        map.add(markers.current.map((item) => item.marker));
        setRevision((value) => value + 1);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          clearTimeout(renderTimer);
          setError(
            error instanceof Error && error.message.startsWith("武汉")
              ? error.message
              : "高德加载失败，请检查网络及地图配置",
          );
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
      clearTimeout(renderTimer);
      if (map) {
        const center = map.getCenter();
        camera.current = {
          center: [center.lng, center.lat],
          zoom: map.getZoom(),
        };
        map.destroy();
      }
      instance.current = null;
      markers.current = [];
    };
  }, [visible, nearby, retry]);
  useEffect(() => {
    const position =
      selected?.position ||
      (selected && resolved.current.get(selected.id)?.position);
    if (position)
      instance.current?.setZoomAndCenter(nearby ? 16 : 13, position);
    markers.current.forEach(({ marker, spot }) =>
      marker.setContent(markerContent(spot)),
    );
  }, [selected, nearby, revision]);
  const lastZoom = useRef(zoomAction);
  useEffect(() => {
    const delta = zoomAction - lastZoom.current;
    lastZoom.current = zoomAction;
    if (instance.current)
      instance.current.setZoom(
        Math.max(3, Math.min(20, instance.current.getZoom() + delta)),
      );
  }, [zoomAction]);
  useEffect(() => {
    if (resetAction) {
      camera.current = null;
      if (outlines.current.length)
        instance.current?.setFitView(outlines.current, true, [50, 40, 70, 40]);
    }
  }, [resetAction]);
  return (
    <div className="city-map is-3d wuhan-only-map">
      <div ref={el} className="live-map" />
      {status !== "live" && (
        <div className="real-map-status" role="status">
          <strong>
            {status === "unconfigured"
              ? "武汉地图待接入"
              : status === "loading"
                ? "正在加载武汉地图…"
                : "地图暂不可用"}
          </strong>
          <p>
            {status === "unconfigured"
              ? "地图服务尚未配置，请稍后再来。"
              : status === "error"
                ? error
                : "正在获取真实地图与地点位置"}
          </p>
          {status === "error" && (
            <button onClick={() => setRetry((value) => value + 1)}>
              重新加载
            </button>
          )}
        </div>
      )}
      {status === "live" && (
        <span className="live-badge">
          高德地图 · 武汉 · 3D 俯瞰
          {missing.length > 0 && (
            <small>以下地点位置待确认，暂未标注：{missing.join("、")}</small>
          )}
        </span>
      )}
    </div>
  );
}
