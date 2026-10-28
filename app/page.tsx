import { Shell } from "@/components/shell";
import { ThemeMotif, TimeArtwork } from "@/components/theme-artwork";
import { HomeCityMap } from "@/components/home-city-map";

export default function Home() {
  return (
    <Shell>
      <main className="home home-simple">
        <section className="hero">
          <div className="hero-copy">
            <div className="theme-overture">
              <ThemeMotif kind="ribbon" />
              <span>以旋律为序 · 与时光同行</span>
            </div>
            <h1>
              奔赴一场热爱，
              <br />
              也遇见<span>一座城。</span>
            </h1>
            <div className="theme-moment-line">
              <ThemeMotif kind="infinity" />
              <span>让热爱，在江城多停留一刻。</span>
            </div>
          </div>
          <TimeArtwork />
        </section>
        <HomeCityMap />
      </main>
    </Shell>
  );
}
