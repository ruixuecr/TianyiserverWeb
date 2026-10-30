import { Flower2, HeartHandshake } from "lucide-react";
import { flowerBaskets, serviceStation, type ActivityKind } from "@/lib/activities";
import { ActivityImage } from "./activity-image";
import { ThemeMotif } from "./theme-artwork";

const icons = {
  "service-station": HeartHandshake,
  "flower-baskets": Flower2,
};
export function ActivityCover({
  kind,
  sizes = "(max-width: 700px) calc(100vw - 40px), (max-width: 850px) 42vw, 420px",
}: {
  kind: ActivityKind;
  sizes?: string;
}) {
  const image = kind === "service-station"
    ? serviceStation.cover
    : flowerBaskets[0]?.images[0];
  if (image) {
    return (
      <div className={`activity-cover cover-${kind} activity-cover-photo`}>
        <ActivityImage
          image={image}
          sizes={sizes}
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
    </div>
  );
}
