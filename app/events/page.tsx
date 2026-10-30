import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shell } from "@/components/shell";
import { ActivityCover } from "@/components/activity-cover";
import { ThemeMotif } from "@/components/theme-artwork";
import { activities } from "@/lib/activities";

export default function Page() {
  return (
    <Shell>
      <main className="listing-page community-page">
        <ThemeMotif kind="blossoms" className="listing-blossoms" />
        <h1>活动现场</h1>
        <div className="activity-index-grid">
          {activities.map((activity, index) => (
            <Link
              className="activity-entry"
              key={activity.id}
              href={`/events/${activity.id}`}
            >
              <ActivityCover
                kind={activity.id}
                sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 850px) 42vw, 50vw"
              />
              <div className="activity-entry-copy">
                <span className="community-eyebrow">
                  0{index + 1}
                </span>
                <h2>
                  {activity.title}
                  <ArrowUpRight size={21} />
                </h2>
                <span className="activity-status">{activity.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </Shell>
  );
}
