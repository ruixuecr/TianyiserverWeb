export type Recommendation = {
  id: string;
  name: string;
  kind: "美食" | "商场";
  district: string;
  area: string;
  description: string;
  tags: string[];
  mapQuery: string;
  spotId?: string;
};

// General itinerary ideas, not live opening hours or confirmed activity locations.
export const recommendations: Recommendation[] = [
  {
    id: "tianbao",
    name: "天宝饭庄",
    kind: "美食",
    district: "江岸区",
    area: "西马街道苗栗路12号",
    description:
      "把一顿正餐留给江城烟火气。和同行的人围坐一桌，给出行补充一点能量。",
    tags: ["正餐聚会", "已有打卡攻略"],
    mapQuery: "天宝饭庄 苗栗路12号",
    spotId: "tianbao",
  },
  {
    id: "liangdao-street",
    name: "粮道街",
    kind: "美食",
    district: "武昌区",
    area: "粮道街沿线",
    description:
      "用一份过早开启武汉的一天。沿街慢慢走，在小吃和老街之间挑选喜欢的味道。",
    tags: ["武汉过早", "街巷小吃"],
    mapQuery: "武汉粮道街",
  },
  {
    id: "hubu-alley",
    name: "户部巷",
    kind: "美食",
    district: "武昌区",
    area: "司门口片区",
    description:
      "想把几种小吃放进同一段行程，可以从这里开始，再顺路走走老城街巷。",
    tags: ["小吃漫步", "老城顺游"],
    mapQuery: "武汉户部巷",
  },
  {
    id: "wuhan-tiandi",
    name: "武汉天地",
    kind: "商场",
    district: "江岸区",
    area: "永清片区",
    description:
      "逛逛开放街区，在餐厅、店铺与休憩空间之间慢下来，适合把吃饭和散步排在一起。",
    tags: ["开放街区", "餐饮休闲"],
    mapQuery: "武汉天地",
  },
  {
    id: "dream-plaza",
    name: "武商梦时代",
    kind: "商场",
    district: "武昌区",
    area: "宝通寺片区",
    description:
      "把餐饮、购物和休息安排在一处。雨天或想轻松逛一逛时，可以作为行程中的一站。",
    tags: ["室内逛街", "餐饮购物"],
    mapQuery: "武商梦时代",
  },
  {
    id: "han-street",
    name: "楚河汉街",
    kind: "商场",
    district: "武昌区",
    area: "楚河汉街片区",
    description:
      "沿着街区边走边逛，找一间店坐下，再把傍晚的时间留给散步与合照。",
    tags: ["街区漫步", "购物休闲"],
    mapQuery: "武汉楚河汉街",
  },
];
