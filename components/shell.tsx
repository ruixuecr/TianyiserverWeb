"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Compass, MapPin } from "lucide-react";
import { TimeTheme, WuhanMoment } from "./time-theme";
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <TimeTheme>
      <header className="header">
        <Link href="/" className="brand">
          <span className="brand-icon" aria-hidden="true">
            <Compass size={22} />
          </span>
          <span>活动指南</span>
        </Link>
        <nav>
          {[
            ["/", "首页"],
            ["/map", "打卡推荐"],
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
    </TimeTheme>
  );
}
