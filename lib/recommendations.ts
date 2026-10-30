export type Recommendation = {
  id: string;
  name: string;
  kind: "美食" | "商场";
  district?: string;
  area?: string;
  tags: string[];
  mapQuery: string;
  spotId?: string;
};

// Names and tags supplied by the user; map queries open AMap location selection.
export const recommendations: Recommendation[] = [
  {
    id: "tianbao",
    name: "天寶饭庄（苗栗路店）",
    kind: "美食",
    district: "江岸区",
    area: "西马街道苗栗路12号",
    tags: [],
    mapQuery: "天宝饭庄 苗栗路12号",
    spotId: "tianbao",
  },
  {
    id: "xiaomin-jianghan-road",
    name: "小民大排挡（江汉路店）",
    kind: "美食",
    tags: ["宵夜", "小吃"],
    mapQuery: "武汉 小民大排挡 江汉路店",
  },
  {
    id: "x118",
    name: "x118",
    kind: "商场",
    tags: ["武汉最大的二次元商场"],
    mapQuery: "武汉 x118",
  },
  {
    id: "central-department-store-jianghan-road",
    name: "中心百货（江汉路店）",
    kind: "商场",
    tags: ["3楼有很多周边店"],
    mapQuery: "武汉 中心百货 江汉路店",
  },
  {
    id: "hankou-stay",
    name: "汉口stay",
    kind: "商场",
    tags: ["有一家超大的中古店"],
    mapQuery: "武汉 汉口stay",
  },
];
