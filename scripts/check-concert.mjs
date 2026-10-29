import assert from "node:assert/strict";
import { test } from "node:test";
import { CONCERT_START_MS, HOUR_HAND_CYCLE_MS, concertColorLayers, concertCountdown } from "../lib/concert.ts";

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

test("one colour drains per 12-hour revolution, including exact boundaries", () => {
  const before = CONCERT_START_MS - 4.5 * HOUR_HAND_CYCLE_MS;
  const layers = concertColorLayers(before);
  assert.equal(layers.length, 5);
  assert.deepEqual(layers.map(layer => layer.progress), [1, 1, 1, 1, 0.5]);
  assert.equal(concertColorLayers(before + HOUR_HAND_CYCLE_MS).length, 4);
  assert.equal(concertColorLayers(CONCERT_START_MS - 4 * HOUR_HAND_CYCLE_MS - 1).length, 5);
  assert.equal(concertColorLayers(CONCERT_START_MS - 4 * HOUR_HAND_CYCLE_MS).length, 4);
  assert.deepEqual(concertColorLayers(CONCERT_START_MS - 0.5 * HOUR_HAND_CYCLE_MS), [{ index: 0, progress: 0.5 }]);
});

test("no colour remains at or after the concert; later visits do not restart it", () => {
  assert.equal(concertColorLayers(CONCERT_START_MS - 1).length, 1);
  for (const now of [CONCERT_START_MS, CONCERT_START_MS + 1, Date.parse("2027-01-01T00:00:00Z")]) {
    assert.deepEqual(concertColorLayers(now), []);
  }
  const instant = CONCERT_START_MS - 35 * 3600_000;
  assert.deepEqual(concertColorLayers(instant), concertColorLayers(Date.parse(new Date(instant).toISOString())));
});
