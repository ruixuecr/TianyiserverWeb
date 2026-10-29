// User-confirmed start, explicitly in Wuhan's UTC+8 time zone.
export const CONCERT_START = "2026-10-31T19:12:00+08:00";
export const CONCERT_START_MS = Date.parse(CONCERT_START);
export const HOUR_HAND_CYCLE_MS = 12 * 3600_000;

// Each colour holds one remaining hour-hand revolution. The outermost colour
// drains first; absolute time keeps the same progress after a reload or sleep.
export function concertColorLayers(now: number) {
  const remaining = Math.max(0, CONCERT_START_MS - now);
  return Array.from(
    { length: Math.ceil(remaining / HOUR_HAND_CYCLE_MS) },
    (_, index) => ({
      index,
      progress: Math.min(1, (remaining - index * HOUR_HAND_CYCLE_MS) / HOUR_HAND_CYCLE_MS),
    }),
  );
}

export function concertCountdown(now: number) {
  const seconds = Math.max(0, Math.ceil((CONCERT_START_MS - now) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return {
    started: now >= CONCERT_START_MS,
    text: [hours, minutes, seconds % 60]
      .map((part) => String(part).padStart(2, "0"))
      .join(":"),
  };
}
