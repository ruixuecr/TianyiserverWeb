"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MapPin, Music2 } from "lucide-react";
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <>
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
        <Link href="/map" className="header-link">
          <MapPin size={15} /> 武汉城市指南 <ArrowUpRight size={15} />
        </Link>
      </header>
      {children}
      <footer>
        <Link href="/" className="brand">
          江城 <span className="brand-en">encore.</span>
        </Link>
        <p>为一场演唱会而来，为一座城市停留。</p>
        <span>武汉漫游指南 · DEMO 2026</span>
      </footer>
    </>
  );
}
