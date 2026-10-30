import { Flower2, HeartHandshake, Soup } from "lucide-react";
import { serviceStation, type ActivityKind } from "@/lib/activities";
import { ActivityImage } from "./activity-image";
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
  if (kind === "service-station") {
    return (
      <div className="activity-cover cover-service-station activity-cover-photo">
        <ActivityImage
          image={serviceStation.cover}
          sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 850px) 42vw, 420px"
        />
      </div>
    );
  }
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
