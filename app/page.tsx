import { Shell } from "@/components/shell";
import { Art } from "@/components/art";
import { HomeCityMap } from "@/components/home-city-map";

export default function Home() {
  return (
    <Shell>
      <main className="home home-simple">
        <section className="hero">
          <div className="hero-copy">
            <h1>
              奔赴一场热爱，
              <br />
              也遇见<span>一座城。</span>
            </h1>
          </div>
          <div
            className="hero-visual"
            role="img"
            aria-label="武汉鹦鹉洲大桥插画"
          >
            <Art theme="river" />
          </div>
        </section>
        <HomeCityMap />
      </main>
    </Shell>
  );
}
