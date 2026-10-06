"use client";
import { useEffect, useRef, useState } from "react";
import { Spot, spots } from "@/lib/data";

type Marker = { setContent: (content: HTMLElement) => void };
type MapInstance = {
  destroy: () => void;
  add: (markers: Marker[]) => void;
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
  if (window.AMap?.PlaceSearch) return Promise.resolve(window.AMap);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<AmapSDK>((resolve, reject) => {
    window._AMapSecurityConfig = {
      serviceHost: window.location.origin + "/_AMapService",
    };
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(process.env.NEXT_PUBLIC_AMAP_KEY || "")}&plugin=AMap.Scale,AMap.PlaceSearch`;
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      reject(new Error("高德地图加载失败，请检查网络和 Key 配置"));
    };
    const timer = setTimeout(fail, 15000);
    script.onload = () => {
      clearTimeout(timer);
      window.AMap?.PlaceSearch ? resolve(window.AMap) : fail();
    };
    script.onerror = fail;
    document.head.appendChild(script);
  }).catch((error) => {
    sdkPromise = null;
    throw error;
  });
  return sdkPromise;
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
  mode = "3D",
  zoomAction = 0,
  resetAction = 0,
  nearby = false,
}: {
  visible?: Spot[];
  selected?: Spot;
  onSelect: (spot: Spot) => void;
  onDeselect?: () => void;
  mode?: "2D" | "3D";
  zoomAction?: number;
  resetAction?: number;
  nearby?: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const instance = useRef<MapInstance | null>(null);
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
    button.className = `amap-pin ${callbacks.current.selected?.id === spot.id ? "selected" : ""}`;
    button.setAttribute("aria-label", spot.name);
    button.setAttribute(
      "aria-pressed",
      String(callbacks.current.selected?.id === spot.id),
    );
    const dot = document.createElement("span");
    dot.textContent = "●";
    button.append(dot, document.createTextNode(spot.name));
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
        map = new sdk.Map(el.current, {
          viewMode: mode,
          pitch: mode === "3D" ? 52 : 0,
          rotation: mode === "3D" ? -18 : 0,
          zoom: camera.current?.zoom || 11,
          center: camera.current?.center || [114.305, 30.56],
          mapStyle: "amap://styles/normal",
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
      .catch(() => {
        if (!cancelled) {
          setError("高德加载失败，请检查网络及地图配置");
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
  }, [mode, visible, nearby, retry]);
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
      instance.current?.setZoomAndCenter(11, [114.305, 30.56]);
    }
  }, [resetAction]);
  return (
    <div className={`city-map ${mode === "3D" ? "is-3d" : ""}`}>
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
          高德地图 · 武汉 · {mode}
          {missing.length > 0 && (
            <small>以下地点位置待确认，暂未标注：{missing.join("、")}</small>
          )}
        </span>
      )}
    </div>
  );
}
