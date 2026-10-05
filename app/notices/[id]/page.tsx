import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { notices } from "@/lib/data";
export function generateStaticParams() {
  return notices.map((n) => ({ id: n.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const n = notices.find((n) => n.id === id);
  if (!n) notFound();
  return (
    <Shell>
      <main className="article-page">
        <Link href="/notices" className="back-link">
          ← 全部通知
        </Link>
        <div className="eyebrow">
          {n.tag} · {n.date}
        </div>
        <h1>{n.title}</h1>
        <p>{n.text}</p>
        <Link href="/map" className="button">
          继续探索武汉 ↗
        </Link>
      </main>
    </Shell>
  );
}
