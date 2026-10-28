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
        <div className="eyebrow">TOGETHER, BEYOND THE STAGE</div>
        <h1>把好时光，留给相聚。</h1>
        <p className="page-intro">
          一处服务站，一篮心意，一桌热闹。让热爱在现场之外继续。
        </p>
        <div className="activity-index-grid">
          {activities.map((activity, index) => (
            <Link
              className="activity-entry"
              key={activity.id}
              href={`/events/${activity.id}`}
            >
              <ActivityCover kind={activity.id} />
              <div className="activity-entry-copy">
                <span className="community-eyebrow">
                  0{index + 1} / {activity.english}
                </span>
                <h2>
                  {activity.title}
                  <ArrowUpRight size={21} />
                </h2>
                <p>{activity.description}</p>
                <span className="activity-status">{activity.status}</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="community-footnote">
          活动地点、时间与发放安排确认后，会在对应页面更新。
        </p>
      </main>
    </Shell>
  );
}
