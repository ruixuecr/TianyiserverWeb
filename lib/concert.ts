// User-confirmed start, explicitly in Wuhan's UTC+8 time zone.
export const CONCERT_START = "2026-10-31T19:12:00+08:00";
export const CONCERT_START_MS = Date.parse(CONCERT_START);

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
