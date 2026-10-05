import { notFound } from "next/navigation";
import { spots } from "@/lib/data";
import { Shell } from "@/components/shell";
import { SpotDetail } from "@/components/spot-detail";
export function generateStaticParams() {
  return spots.map((s) => ({ id: s.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `${spots.find((s) => s.id === id)?.name || "地点"} · 江城 Encore`,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spot = spots.find((s) => s.id === id);
  if (!spot) notFound();
  return (
    <Shell>
      <SpotDetail spot={spot} />
    </Shell>
  );
}
