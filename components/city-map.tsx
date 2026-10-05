"use client";
import { useEffect, useRef, useState } from "react";
import { Spot, spots } from "@/lib/data";
type MapInstance = {
  destroy: () => void;
  add: (markers: unknown[]) => void;
  setZoomAndCenter: (zoom: number, center: number[]) => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number;
  getCenter: () => { lng: number; lat: number };
  addControl: (control: unknown) => void;
  on: (event: string, handler: () => void) => void;
};
type AmapSDK = {
  Map: new (el: HTMLElement, options: Record<string, unknown>) => MapInstance;
  Marker: new (options: Record<string, unknown>) => {
    on: (event: string, handler: () => void) => void;
  };
  Scale: new () => unknown;
};
declare global {
  interface Window {
    AMap?: AmapSDK;
    _AMapSecurityConfig?: { serviceHost: string };
  }
}
let sdkPromise: Promise<AmapSDK> | null = null;
function loadMap() {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<AmapSDK>((resolve, reject) => {
    window._AMapSecurityConfig = {
      serviceHost: window.location.origin + "/_AMapService",
    };
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(process.env.NEXT_PUBLIC_AMAP_KEY || "")}&plugin=AMap.Scale`;
    const timer = setTimeout(() => reject(new Error("地图加载超时")), 12000);
    script.onload = () => {
      clearTimeout(timer);
      window.AMap ? resolve(window.AMap) : reject(new Error("地图不可用"));
    };
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error("网络连接失败"));
    };
    document.head.appendChild(script);
  }).catch((e) => {
    sdkPromise = null;
    throw e;
  });
  return sdkPromise;
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
  onSelect: (s: Spot) => void;
  onDeselect?: () => void;
  mode?: "2D" | "3D";
  zoomAction?: number;
  resetAction?: number;
  nearby?: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const instance = useRef<MapInstance | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onDeselectRef = useRef(onDeselect);
  onDeselectRef.current = onDeselect;
  const camera = useRef<{ center: number[]; zoom: number } | null>(null);
  const [status, setStatus] = useState<"loading" | "live" | "demo" | "error">(
    process.env.NEXT_PUBLIC_AMAP_KEY ? "loading" : "demo",
  );
  const [demoScale, setDemoScale] = useState(1);
  const demoPlane = useRef<HTMLDivElement>(null);
  const labelLayer = useRef<HTMLDivElement>(null);
  const [labelPositions, setLabelPositions] = useState<
    Record<string, { left: number; top: number }>
  >({});
  useEffect(() => {
    const plane = demoPlane.current;
    const layer = labelLayer.current;
    if (!plane || !layer || status === "live") return;
    let frame = 0;
    let until = 0;
    // Project anchors with the map, but render text in a separate flat layer.
    const measure = () => {
      const bounds = layer.getBoundingClientRect();
      const positions: Record<string, { left: number; top: number }> = {};
      plane
        .querySelectorAll<HTMLElement>("[data-spot-anchor]")
        .forEach((anchor) => {
          const point = anchor.getBoundingClientRect();
          positions[anchor.dataset.spotAnchor!] = {
            left: Math.round(point.left - bounds.left),
            top: Math.round(point.top - bounds.top),
          };
        });
      setLabelPositions(positions);
      if (performance.now() < until) frame = requestAnimationFrame(measure);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      until = performance.now() + 650;
      measure();
    };
    const observer = new ResizeObserver(refresh);
    observer.observe(plane);
    refresh();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [demoScale, mode, status, visible, nearby]);
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_AMAP_KEY || !el.current) return;
    let cancelled = false;
    let renderTimer: ReturnType<typeof setTimeout> | undefined;
    setStatus("loading");
    loadMap()
      .then((A) => {
        if (cancelled || !el.current) return;
        try {
          const map = new A.Map(el.current, {
            viewMode: mode,
            pitch: mode === "3D" ? 52 : 0,
            rotation: mode === "3D" ? -18 : 0,
            zoom:
              camera.current?.zoom || (nearby && selected?.position ? 16 : 11),
            center: camera.current?.center ||
              selected?.position || [114.305, 30.56],
            mapStyle: "amap://styles/normal",
            showBuildingBlock: true,
            resizeEnable: true,
          });
          instance.current = map;
          map.on("click", () => onDeselectRef.current?.());
          renderTimer = setTimeout(() => {
            if (!cancelled) setStatus("error");
          }, 15000);
          map.on("complete", () => {
            clearTimeout(renderTimer);
            if (!cancelled) setStatus("live");
          });
          map.on("error", () => {
            clearTimeout(renderTimer);
            if (!cancelled) setStatus("error");
          });
          map.addControl(new A.Scale());
          map.add(
            visible
              .filter((s) => s.position)
              .map((s) => {
                const marker = new A.Marker({
                  position: s.position,
                  content: `<button class="amap-pin" aria-label="${s.name}"><span>●</span>${s.name}</button>`,
                  anchor: "bottom-center",
                  bubble: false,
                });
                marker.on("click", () => onSelectRef.current(s));
                return marker;
              }),
          );
        } catch {
          setStatus("error");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
      clearTimeout(renderTimer);
      if (instance.current) {
        const center = instance.current.getCenter();
        camera.current = {
          center: [center.lng, center.lat],
          zoom: instance.current.getZoom(),
        };
        instance.current.destroy();
        instance.current = null;
      }
    };
  }, [mode, visible, nearby]);
  useEffect(() => {
    if (selected?.position && instance.current)
      instance.current.setZoomAndCenter(nearby ? 16 : 13, selected.position);
  }, [selected, nearby]);
  const lastZoom = useRef(zoomAction);
  useEffect(() => {
    const delta = zoomAction - lastZoom.current;
    lastZoom.current = zoomAction;
    if (instance.current)
      instance.current.setZoom(
        Math.max(3, Math.min(20, instance.current.getZoom() + delta)),
      );
    else setDemoScale((v) => Math.max(0.7, Math.min(1.6, v + delta * 0.1)));
  }, [zoomAction]);
  useEffect(() => {
    if (resetAction) {
      camera.current = null;
      instance.current?.setZoomAndCenter(11, [114.305, 30.56]);
      setDemoScale(1);
    }
  }, [resetAction]);
  return (
    <div className={`city-map ${mode === "3D" ? "is-3d" : ""}`}>
      <div ref={el} className="live-map" />
      {status !== "live" && (
        <div className="demo-map" onClick={() => onDeselect?.()}>
          <div
            ref={demoPlane}
            className="map-plane"
            style={{
              transform: `scale(${demoScale}) ${mode === "3D" ? "perspective(1100px) rotateX(24deg) rotateZ(-9deg)" : "rotate(0deg)"}`,
            }}
          >
            <svg
              viewBox="0 0 1000 760"
              preserveAspectRatio="none"
              className="map-svg"
            >
              <defs>
                <pattern
                  id="grid"
                  width="48"
                  height="48"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(-12)"
                >
                  <rect width="48" height="48" fill="#e4e9dd" />
                  <path
                    d="M0 0h48v48"
                    fill="none"
                    stroke="#fafbf3"
                    strokeWidth="6"
                  />
                </pattern>
                <filter id="shadow">
                  <feDropShadow
                    dx="0"
                    dy="12"
                    stdDeviation="0"
                    floodColor="#b6c3ab"
                  />
                </filter>
              </defs>
              <path
                filter="url(#shadow)"
                d="M98 203L188 110 327 91 422 53 515 100 580 83 663 144 822 134 899 224 864 310 932 389 859 468 881 587 741 650 649 632 539 706 413 669 326 704 251 617 116 593 131 464 63 393 103 306Z"
                fill="url(#grid)"
                stroke="#fcfff8"
                strokeWidth="4"
              />
              <path
                d="M245 0C360 175 530 180 488 319S427 428 540 501 697 625 706 800"
                stroke="#92c4c0"
                strokeWidth="55"
                fill="none"
              />
              <path
                d="M-30 475C193 407 300 440 480 343"
                stroke="#92c4c0"
                strokeWidth="23"
                fill="none"
              />
              <path
                d="M711 220q120-90 131 8t-30 79q-39-25-58 30t-65-9q-10-38 22-108"
                fill="#92c4c0"
              />
              <g fill="#c5d6b7">
                <path d="M174 243l55-35 66 36-29 57-74-3z" />
                <path d="M613 425l70-40 61 43-21 76-108-8z" />
                <path d="M323 535l69-30 45 50-38 53-75-18z" />
              </g>
              <g stroke="#fafaf0" strokeWidth="12" fill="none">
                <path d="M144 550L751 174M172 206L820 600M198 375L805 387M358 139L319 603M608 161L606 616" />
              </g>
              <g stroke="#dcc99e" strokeWidth="3" fill="none">
                <path d="M144 550L751 174M172 206L820 600M198 375L805 387" />
              </g>
              <g
                fill="#8da091"
                fontSize="25"
                fontFamily="sans-serif"
                letterSpacing="10"
              >
                <text x="267" y="280">
                  汉口
                </text>
                <text x="600" y="380">
                  武昌
                </text>
                <text x="260" y="580">
                  汉阳
                </text>
                <text x="755" y="270" fill="#538e8a" fontSize="17">
                  东湖
                </text>
                <text
                  x="493"
                  y="490"
                  fill="#528f8a"
                  fontSize="17"
                  transform="rotate(40 493 490)"
                >
                  长 江
                </text>
              </g>
            </svg>
            {visible.map((s) => (
              <span
                key={s.id}
                data-spot-anchor={s.id}
                className="map-anchor"
                style={{ left: s.x + "%", top: s.y + "%" }}
              />
            ))}
          </div>
          <div ref={labelLayer} className="map-label-layer">
            {visible.map((s) => (
              <button
                key={s.id}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(s);
                }}
                className={`map-marker ${selected?.id === s.id ? "selected" : ""}`}
                style={{
                  ...labelPositions[s.id],
                  visibility: labelPositions[s.id] ? "visible" : "hidden",
                }}
              >
                <span>{s.category === "演出场馆" ? "♫" : "●"}</span>
                <b>{s.name}</b>
              </button>
            ))}
          </div>
          <div className="map-disclaimer">
            {status === "loading"
              ? "正在加载高德地图…"
              : status === "error"
                ? "高德地图暂不可用 · 已切换交互示意图"
                : "交互示意图 · 非真实地理底图"}
            <small>示意位置仅用于界面演示，不用于实际导航</small>
          </div>
        </div>
      )}
      {status === "live" && (
        <span className="live-badge">
          高德地图 · {mode}{" "}
          {nearby && selected?.position ? "周边视图" : "城市视图"}
          {visible.some((s) => !s.position) &&
            " · 精确点位待核实，请从列表进入高德选点"}
        </span>
      )}
    </div>
  );
}
