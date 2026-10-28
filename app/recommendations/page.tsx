import { Shell } from "@/components/shell";
import { ThemeMotif } from "@/components/theme-artwork";
import { RecommendationExplorer } from "@/components/recommendation-explorer";

export const metadata = { title: "美食商场推荐 · 江城 Encore" };
export default function Page() {
  return (
    <Shell>
      <main className="listing-page community-page recommendations-page">
        <ThemeMotif kind="blossoms" className="listing-blossoms" />
        <div className="eyebrow">A TASTE OF WUHAN, A LITTLE CITY WALK</div>
        <h1>吃一口江城，逛一段好时光。</h1>
        <p className="page-intro">
          演唱会之外，也给美食、街区和商场留一点时间。
        </p>
        <RecommendationExplorer />
        <p className="community-footnote">
          这里是出行灵感推荐；营业时间、店铺及现场活动以商户当日信息为准。活动参与门店请到对应活动页确认。
        </p>
      </main>
    </Shell>
  );
}
