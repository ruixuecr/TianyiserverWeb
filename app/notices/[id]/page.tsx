import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { notices } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return notices.map((notice) => ({ id: notice.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = notices.find((notice) => notice.id === id);
  return { title: `${notice?.title || "通知公告"} · 活动指南` };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = notices.find((notice) => notice.id === id);
  if (!notice) notFound();
  const metadata = [notice.tag, notice.date].filter(Boolean).join(" · ");

  return (
    <Shell>
      <main className="article-page">
        <Link href="/notices" className="back-link">
          ← 全部通知
        </Link>
        {metadata && <div className="eyebrow">{metadata}</div>}
        <h1>{notice.title}</h1>
        <p>{notice.text}</p>
      </main>
    </Shell>
  );
}
