"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MapPin, Music2 } from "lucide-react";
import { TimeTheme, WuhanMoment } from "./time-theme";
import { ThemeMotif } from "./theme-artwork";
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <TimeTheme>
      <header className="header">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <Music2 size={22} />
          </span>
          <span>
            江城<span className="brand-en">encore.</span>
          </span>
        </Link>
        <nav>
          {[
            ["/", "首页"],
            ["/map", "探索地图"],
            ["/events", "活动现场"],
            ["/recommendations", "美食商场"],
            ["/notices", "通知公告"],
          ].map(([url, label]) => (
            <Link
              key={url}
              href={url}
              className={
                path === url || (url !== "/" && path.startsWith(url))
                  ? "active"
                  : ""
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-tools">
          <WuhanMoment />
          <Link href="/map" className="header-link">
            <MapPin size={15} /> 城市指南 <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>
      {children}
      <footer>
        <Link href="/" className="brand">
          江城 <span className="brand-en">encore.</span>
        </Link>
        <p>
          <ThemeMotif kind="note" />
        </p>
        <span>武汉漫游指南 · DEMO 2026</span>
      </footer>
    </TimeTheme>
  );
}
