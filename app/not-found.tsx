import Link from "next/link";
export default function NotFound() {
  return (
    <main className="article-page">
      <div className="eyebrow">404 / LOST IN THE CITY</div>
      <h1>这条小路，还没有收录。</h1>
      <p>回到地图，重新发现武汉。</p>
      <Link href="/map" className="button">
        返回城市地图 ↗
      </Link>
    </main>
  );
}
