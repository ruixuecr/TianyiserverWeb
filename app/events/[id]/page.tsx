import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { ActivityCover } from "@/components/activity-cover";
import { BasketGallery } from "@/components/basket-gallery";
import {
  HaidilaoDetails,
  ServiceStationDetails,
} from "@/components/activity-details";
import { activities } from "@/lib/activities";

export function generateStaticParams() {
  return activities.map((activity) => ({ id: activity.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (["weekend", "sunset", "walk"].includes(id)) redirect("/events");
  const activity = activities.find((activity) => activity.id === id);
  if (!activity) notFound();
  return (
    <Shell>
      <main className="detail-page community-page">
        <Link href="/events" className="back-link">
          ← 所有活动
        </Link>
        <header className="activity-detail-heading">
          <div>
            <h1>{activity.title}</h1>
            <span className="activity-status">{activity.status}</span>
          </div>
          <ActivityCover kind={activity.id} />
        </header>
        {activity.id === "flower-baskets" ? (
          <BasketGallery />
        ) : activity.id === "service-station" ? (
          <ServiceStationDetails />
        ) : (
          <HaidilaoDetails />
        )}
      </main>
    </Shell>
  );
}
