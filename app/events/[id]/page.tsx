import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { Art } from "@/components/art";
import { events, spots } from "@/lib/data";
export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const e = events.find((e) => e.id === id);
  if (!e) notFound();
  const related = e.spotIds;
  return (
    <Shell>
      <main className="detail-page">
        <Link href="/events" className="back-link">
          ← 所有活动
        </Link>
        <div className="detail-hero">
          <div>
            <div className="eyebrow">{e.date}</div>
            <h1>{e.title}</h1>
            <p className="detail-description">{e.description}</p>
            <div className="demo-notice">
              这是展示页面，不提供真实演出时间、票务或报名服务。
            </div>
            <Link href="/map" className="button">
              在地图上规划行程 ↗
            </Link>
          </div>
          <Art theme={e.theme} />
        </div>
        <section className="section">
          <h2>沿途，值得停留</h2>
          <div className="spot-grid">
            {related.map((id) => {
              const s = spots.find((s) => s.id === id)!;
              return (
                <Link className="spot-card" href={`/spots/${id}`} key={id}>
                  <div className="card-image">
                    <Art theme={s.theme} />
                  </div>
                  <div className="card-title">
                    <h3>{s.name}</h3>
                    <span>{s.area} ↗</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </Shell>
  );
}
