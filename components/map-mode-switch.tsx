"use client";

export type MapMode = "2D" | "3D";

export function MapModeSwitch({
  mode,
  onChange,
}: {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
}) {
  return (
    <div className="mode-switch" role="group" aria-label="地图显示模式">
      {(["2D", "3D"] as const).map((value) => (
        <button
          key={value}
          type="button"
          className={mode === value ? "active" : ""}
          aria-pressed={mode === value}
          onClick={() => onChange(value)}
        >
          {value === "2D" ? "2D 平面" : "3D 俯瞰"}
        </button>
      ))}
    </div>
  );
}
