import Link from "next/link";
import { ArrowUpRight, Bell } from "lucide-react";
import { Shell } from "@/components/shell";
import { ThemeMotif } from "@/components/theme-artwork";
import { notices } from "@/lib/data";
export default function Page() {
  return (
    <Shell>
      <main className="listing-page notice-page">
        <ThemeMotif kind="blossoms" className="listing-blossoms" />
        <h1>通知公告</h1>
        <div className="notice-list">
          {notices.map((n, i) => (
            <Link href={`/notices/${n.id}`} key={n.id}>
              <span className="notice-icon">
                <Bell size={22} />
              </span>
              <div>
                <span className="notice-tag">
                  {n.tag}
                  {i === 0 ? " · 置顶" : ""}
                </span>
                <h2>{n.title}</h2>
                <p>{n.text}</p>
              </div>
              <ArrowUpRight size={22} />
            </Link>
          ))}
        </div>
      </main>
    </Shell>
  );
}
