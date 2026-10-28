import { Flower2, HeartHandshake, Soup } from "lucide-react";
import type { ActivityKind } from "@/lib/activities";
import { ThemeMotif } from "./theme-artwork";

const icons = {
  "service-station": HeartHandshake,
  "flower-baskets": Flower2,
  haidilao: Soup,
};
const labels = {
  "service-station": "MEET & SHARE",
  "flower-baskets": "LOVE IN BLOOM",
  haidilao: "GATHER & GLOW",
};
export function ActivityCover({ kind }: { kind: ActivityKind }) {
  const Icon = icons[kind];
  return (
    <div className={`activity-cover cover-${kind}`} aria-hidden="true">
      <div className="activity-cover-orbit" />
      <ThemeMotif
        kind={kind === "flower-baskets" ? "blossoms" : "ribbon"}
        className="activity-cover-motif"
      />
      <Icon className="activity-cover-icon" size={68} strokeWidth={1} />
      <span className="activity-cover-word">{labels[kind]}</span>
      <span className="activity-cover-caption">江城 · 与你相遇</span>
    </div>
  );
}
