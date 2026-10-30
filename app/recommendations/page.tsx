import { Shell } from "@/components/shell";
import { ThemeMotif } from "@/components/theme-artwork";
import { RecommendationExplorer } from "@/components/recommendation-explorer";

export const metadata = { title: "美食商场推荐 · 江城 Encore" };
export default function Page() {
  return (
    <Shell>
      <main className="listing-page community-page recommendations-page">
        <ThemeMotif kind="blossoms" className="listing-blossoms" />
        <h1>美食商场</h1>
        <RecommendationExplorer />
        <p className="community-footnote">
          营业时间、店铺及现场活动以商户当日信息为准。活动参与门店请到对应活动页确认。
        </p>
      </main>
    </Shell>
  );
}
