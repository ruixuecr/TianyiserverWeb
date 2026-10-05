import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Music2,
  Navigation,
  MoveUpRight,
} from "lucide-react";
import { Shell } from "@/components/shell";
import { Art } from "@/components/art";
import { spots, events } from "@/lib/data";
export default function Home() {
  return (
    <Shell>
      <main className="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> WUHAN · MUSIC · CITY WALKS
            </div>
            <h1>
              奔赴一场热爱，
              <br />
              也遇见<span>一座城。</span>
            </h1>
            <p>
              让演唱会成为出发的理由。
              <br />
              从万人合唱到江边晚风，收藏你的武汉时刻。
            </p>
            <div className="hero-actions">
              <Link className="button" href="/map">
                开启江城漫游 <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="/events">
                看看最近的活动 <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>
                  {String(spots.length).padStart(2, "0")}
                  <span>处</span>
                </strong>
                <small>精选城市打卡点</small>
              </div>
              <div>
                <strong>
                  02<span>种</span>
                </strong>
                <small>2D / 3D 地图视角</small>
              </div>
              <div className="city-coordinates">
                30°35′ N<br />
                114°18′ E <span>就在武汉，等你来。</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <Art theme="river" />
            <span className="visual-top">江城来信 / LETTER FROM WUHAN</span>
            <div className="visual-caption">
              <span>01 / 城市的第一眼</span>
              <h2>江水向东，热爱在此。</h2>
              <span>鹦鹉洲大桥 · 武汉 WUHAN</span>
            </div>
            <div className="round-stamp">
              MEET YOU
              <br />
              <strong>武汉</strong>
              <br />
              IN WUHAN
            </div>
          </div>
        </section>
        <div className="ticker">
          <span>
            <Music2 size={16} />
            把喜欢的歌，唱给喜欢的城市
          </span>
          <span>江边日落 / 老街漫步 / 现场合唱</span>
          <Link href="/notices">
            出发前的小提醒 <ArrowUpRight size={16} />
          </Link>
        </div>
        <section className="section">
          <div className="section-heading">
            <div className="eyebrow">EXPLORE THE CITY</div>
            <div className="heading-row">
              <h2>
                舞台之外，武汉也很好看<span>值得专程，也值得顺路。</span>
              </h2>
              <Link href="/map">
                探索全部地点 <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <div className="spot-grid">
            {spots.slice(0, 3).map((s, i) => (
              <Link className="spot-card" key={s.id} href={`/spots/${s.id}`}>
                <div className="card-image">
                  <Art theme={s.theme} />
                  <span className="image-pill">{s.category}</span>
                  <span className="card-number">0{i + 1}</span>
                  <span className="card-arrow">
                    <MoveUpRight size={20} />
                  </span>
                </div>
                <div className="card-title">
                  <h3>{s.name}</h3>
                  <span>
                    <MapPin size={13} />
                    {s.area}
                  </span>
                </div>
                <p>{s.en}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="map-teaser">
          <div>
            <div className="eyebrow">YOUR CITY, YOUR WAY</div>
            <h2>
              把想去的地方，
              <br />
              连成你的武汉。
            </h2>
            <p>
              一张地图，收好演出场馆与城市风景。
              <br />
              切换俯瞰视角，下一站由你决定。
            </p>
            <Link href="/map" className="button">
              打开城市地图 <Navigation size={16} />
            </Link>
          </div>
          <div className="mini-map">
            <div className="mini-river" />
            <span className="mini-label">汉口</span>
            <span className="mini-label right">武昌</span>
            <b className="mini-pin one">
              <MapPin />
              巴公房子
            </b>
            <b className="mini-pin two">
              <MapPin />
              鹦鹉洲大桥
            </b>
            <b className="mini-pin three">
              <MapPin />
              湖北省博物馆
            </b>
            <small>WUHAN EXPLORER · 地图示意</small>
          </div>
        </section>
        <section className="section">
          <div className="eyebrow">LIVE IN THE MOMENT</div>
          <div className="heading-row">
            <h2>
              下一段好时光<span>在现场，也在路上。</span>
            </h2>
            <Link href="/events">
              所有活动 <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="event-grid">
            {events.slice(0, 2).map((e) => (
              <Link key={e.id} href={`/events/${e.id}`} className="event-strip">
                <Art theme={e.theme} />
                <div>
                  <small>{e.label} · 示例</small>
                  <h3>{e.title}</h3>
                  <p>{e.description}</p>
                  <span>
                    发现更多 <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}
