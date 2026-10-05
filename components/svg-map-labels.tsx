"use client";

import { RefObject, useLayoutEffect, useRef } from "react";
import { Spot } from "@/lib/data";

export function SvgMapLabels({
  plane,
  spots,
  selected,
  onSelect,
  mode,
  scale,
}: {
  plane: RefObject<HTMLDivElement | null>;
  spots: Spot[];
  selected?: Spot;
  onSelect: (spot: Spot) => void;
  mode: "2D" | "3D";
  scale: number;
}) {
  const svg = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    const surface = plane.current;
    const overlay = svg.current;
    if (!surface || !overlay) return;
    let frame = 0;
    let deadline = 0;
    let disposed = false;
    const update = () => {
      const style = getComputedStyle(surface);
      const matrix = new DOMMatrix(
        style.transform === "none" ? undefined : style.transform,
      );
      const [ox, oy] = style.transformOrigin.split(" ").map(parseFloat);
      const project = (x: number, y: number) => {
        const p = matrix.transformPoint(new DOMPoint(x - ox, y - oy));
        return {
          x: p.x / p.w + ox + surface.offsetLeft,
          y: p.y / p.w + oy + surface.offsetTop,
        };
      };
      overlay
        .querySelectorAll<SVGGElement>(".svg-map-marker")
        .forEach((group, i) => {
          const spot = spots[i];
          const x = (surface.clientWidth * spot.x) / 100;
          const y = (surface.clientHeight * spot.y) / 100;
          const p = project(x, y);
          const px = project(x + 1, y);
          const py = project(x, y + 1);
          // Preserve the local tilt/shear, without shrinking the text with map zoom.
          const unit = Math.hypot(px.x - p.x, px.y - p.y);
          group.setAttribute(
            "transform",
            `matrix(${(px.x - p.x) / unit} ${(px.y - p.y) / unit} ${(py.x - p.x) / unit} ${(py.y - p.y) / unit} ${p.x} ${p.y})`,
          );
          const text = group.querySelector<SVGTextElement>(".svg-spot-name")!;
          const width = Math.ceil(text.getComputedTextLength()) + 16;
          group
            .querySelector(".svg-label-bg")!
            .setAttribute("width", String(width));
          group
            .querySelector(".svg-marker-content")!
            .setAttribute("transform", `translate(${-(width + 32) / 2} -32)`);
        });
      overlay.style.visibility = "visible";
      if (performance.now() < deadline) frame = requestAnimationFrame(update);
    };
    const refresh = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      deadline = performance.now() + 700;
      update();
    };
    const observer = new ResizeObserver(refresh);
    observer.observe(surface);
    refresh();
    void document.fonts.ready.then(refresh);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [plane, spots, mode, scale]);

  return (
    <svg ref={svg} className="svg-map-labels" aria-label="地图地点标签">
      {spots.map((spot) => (
        <g
          key={spot.id}
          className={`svg-map-marker ${selected?.id === spot.id ? "selected" : ""}`}
          role="button"
          tabIndex={0}
          aria-label={spot.name}
          aria-pressed={selected?.id === spot.id}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(spot);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onSelect(spot);
            }
          }}
        >
          <g className="svg-marker-content">
            <rect
              className="svg-marker-hit"
              x="-3"
              y="-4"
              width="32"
              height="40"
              rx="8"
            />
            <path
              className="svg-pin"
              d="M9 0H18Q27 0 27 9V24L13.5 32L0 24V9Q0 0 9 0Z"
            />
            <text
              className="svg-pin-symbol"
              x="13.5"
              y="16"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {spot.category === "演出场馆" ? "♫" : "●"}
            </text>
            <rect className="svg-label-bg" x="32" y="1" height="28" rx="4" />
            <text
              className="svg-spot-name"
              x="40"
              y="15"
              dominantBaseline="middle"
            >
              {spot.name}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
