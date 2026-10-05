import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shell } from "@/components/shell";
import { Art } from "@/components/art";
import { events } from "@/lib/data";
export default function Page() {
  return (
    <Shell>
      <main className="listing-page">
        <div className="eyebrow">MORE THAN A CONCERT</div>
        <h1>把好时光，留给现场。</h1>
        <p className="page-intro">音乐响起前后，还有一整座城市值得探索。</p>
        <div className="demo-notice">
          以下为 Demo 活动与路线示例，不代表真实演出安排。
        </div>
        <div className="spot-grid">
          {events.map((e) => (
            <Link className="spot-card" key={e.id} href={`/events/${e.id}`}>
              <div className="card-image">
                <Art theme={e.theme} />
                <span className="image-pill">{e.label}</span>
              </div>
              <p>{e.date}</p>
              <div className="card-title">
                <h3>{e.title}</h3>
                <ArrowUpRight size={20} />
              </div>
              <p className="event-description">{e.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </Shell>
  );
}
