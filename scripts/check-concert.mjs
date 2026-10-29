import assert from "node:assert/strict";
import { test } from "node:test";
import { CONCERT_START_MS, concertCountdown } from "../lib/concert.ts";

test("concert starts at 19:12 in UTC+8 and keeps cumulative hours", () => {
  assert.equal(CONCERT_START_MS, Date.UTC(2026, 9, 31, 11, 12));
  assert.equal(concertCountdown(Date.parse("2026-10-29T10:00:00+08:00")).text, "57:12:00");
  assert.equal(concertCountdown(CONCERT_START_MS - 100 * 3600_000).text, "100:00:00");
});

test("countdown handles minute rollover and never reaches zero early", () => {
  assert.equal(concertCountdown(CONCERT_START_MS - 3600_000).text, "01:00:00");
  assert.equal(concertCountdown(CONCERT_START_MS - 3599_000).text, "00:59:59");
  assert.deepEqual(concertCountdown(CONCERT_START_MS - 1), { started: false, text: "00:00:01" });
});

test("the start and later visits remain at zero, without rolling into another year", () => {
  for (const now of [CONCERT_START_MS, CONCERT_START_MS + 1, Date.parse("2027-01-01T00:00:00Z")]) {
    assert.deepEqual(concertCountdown(now), { started: true, text: "00:00:00" });
  }
});
