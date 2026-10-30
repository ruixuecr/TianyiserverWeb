export const spotYears = [2020, 2023, 2025, 2026] as const;
export type SpotImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};
export type Spot = {
  id: string;
  name: string;
  en: string;
  category: string;
  memoryDate: { year: (typeof spotYears)[number]; month: number };
  area: string;
  // Only populate after confirming the actual GCJ-02 POI; schematic x/y are independent.
  position?: [number, number];
  locationPending?: boolean;
  x: number;
  y: number;
  description: string;
  tip: string;
  address: string;
  theme: string;
  searchName?: string;
  matchAddress?: string;
  thumbnail?: SpotImage;
  featuredImage?: SpotImage;
};
export const spots: Spot[] = [
  {
    id: "lawson-guangsha",
    memoryDate: { year: 2023, month: 7 },
    featuredImage: {
      src: "/images/spots/lawson-guangsha.png",
      width: 1280,
      height: 960,
      alt: "中百罗森广厦华庭店主题装饰",
    },
    name: "中百罗森(广厦华庭店)",
    en: "LAWSON · GUANGSHA HUATING",
    category: "街角小店",
    area: "武汉 · 门店位置待核实",
    x: 75,
    y: 59,
    description:
      "天依与罗森在武汉的联动店，时隔三年依旧保留着当年的痕迹",
    tip: "请认准广厦华庭店；拍照时请勿遮挡店门或影响顾客通行，营业与店内活动以门店信息为准。",
    address: "武汉市中百罗森广厦华庭店（以高德门店地址为准）",
    theme: "shop",
  },
  {
    id: "yingwuzhou-bridge",
    memoryDate: { year: 2020, month: 3 },
    featuredImage: {
      src: "/images/spots/yingwuzhou-bridge.png",
      width: 2556,
      height: 1704,
      alt: "鹦鹉洲大桥主题打卡图片",
    },
    name: "鹦鹉洲大桥",
    en: "YINGWUZHOU YANGTZE RIVER BRIDGE",
    category: "江岸漫步",
    area: "汉阳 / 武昌",
    x: 43,
    y: 63,
    description: `洛天依跨次元芭莎登封取景

“每一张被定格的美丽画面背后，都有一段美好的故事，这是天依与武汉的美好邂逅，也是天依与时尚芭莎的神奇相遇。”`,
    tip: "请选择合法开放的江岸或人行区域拍照。两岸观景点不同，请在高德中确认想去的岸侧与入口。",
    address: "武汉市汉阳区与武昌区之间的长江江面",
    theme: "river",
    searchName: "鹦鹉洲长江大桥",
  },
  {
    id: "tianbao",
    memoryDate: { year: 2025, month: 12 },
    searchName: "天宝饭庄",
    matchAddress: "苗栗路12号",
    featuredImage: {
      src: "/images/spots/tianbao.png",
      width: 1778,
      height: 2556,
      alt: "天宝饭庄主题打卡图片",
    },
    name: "天宝饭庄",
    en: "TIANBAO RESTAURANT",
    category: "美食探店",
    area: "江岸区",
    x: 32,
    y: 37,
    description:
      "给旅程留一顿好好吃饭的时间。和同行的人围坐一桌，把期待与快乐都聊进烟火气里。",
    tip: "门店位于西马街道苗栗路12号，从苗栗路地铁站D口步行约480米。营业时间与预约要求以门店信息为准。",
    address: "武汉市江岸区西马街道苗栗路12号",
    theme: "food",
  },
  {
    id: "bagong-house",
    memoryDate: { year: 2025, month: 12 },
    featuredImage: {
      src: "/images/spots/bagong-house.png",
      width: 1260,
      height: 2244,
      alt: "巴公房子对应的演唱会宣传海报",
    },
    name: "巴公房子",
    en: "BAGONG HOUSE",
    category: "城市地标",
    area: "江岸区",
    x: 47,
    y: 26,
    description:
      "沿着汉口老街走到红砖转角，在巴公房子前，收下一张有旧时光温度的城市照片。",
    tip: "建议从公共街道取景，留意路口来车。建筑内部开放与消费规则以现场为准。",
    address: "武汉市江岸区鄱阳街、洞庭街一带",
    theme: "house",
  },
  {
    id: "guobo",
    memoryDate: { year: 2025, month: 12 },
    featuredImage: {
      src: "/images/spots/guobo.webp",
      width: 1052,
      height: 701,
      alt: "武汉国际博览中心演出现场",
    },
    name: "国博",
    en: "WUHAN INTERNATIONAL EXPO CENTER",
    category: "演出场馆",
    area: "汉阳区",
    x: 26,
    y: 78,
    description:
      "在武汉国际博览中心，遇见期待的展览与现场。先确认场馆与入口，再轻松开启今天的行程。",
    tip: "国博包含多个展馆与入口，请以活动主办方公布的馆号、入场口和时间为准。",
    address: "武汉国际博览中心 · 汉阳区鹦鹉大道619号",
    theme: "stage",
    searchName: "武汉国际博览中心",
  },
  {
    id: "aoti",
    memoryDate: { year: 2026, month: 10 },
    searchName: "湖北省奥林匹克体育中心体育馆西门",
    name: "奥体",
    en: "OLYMPIC SPORTS CENTER",
    category: "演出场馆",
    area: "江夏区 · 东湖高新区",
    x: 83,
    y: 78,
    description:
      "把热爱带到现场，把合唱留给夜空。提前核对具体场馆，让这场奔赴从容一点。",
    tip: "目的地为湖北省奥林匹克体育中心体育馆西门，位于佛祖岭一路2号。活动当天请以主办方公布的入场安排为准。",
    address:
      "武汉市江夏区东湖新技术开发区佛祖岭一路2号湖北省奥林匹克体育中心体育馆西门",
    theme: "stage",
  },
  {
    id: "hubei-museum",
    memoryDate: { year: 2026, month: 6 },
    featuredImage: {
      src: "/images/spots/hubei-museum.png",
      width: 1052,
      height: 592,
      alt: "博物馆地点主题设计图片",
    },
    name: "武汉博物馆",
    searchName: "武汉博物馆",
    en: "WUHAN MUSEUM",
    category: "文化场馆",
    area: "江汉区",
    x: 69,
    y: 34,
    description:
      "走进武汉博物馆，在文物与城市历史之间，认识这座城的另一面。给演唱会之外的武汉，再留一段安静的时光。",
    tip: "出发前请通过武汉博物馆官方渠道查看预约要求、开放时间与入馆安排。",
    address: "武汉市江汉区青年路373号",
    theme: "museum",
  },
  {
    id: "donghu",
    name: "东湖",
    en: "EAST LAKE",
    memoryDate: { year: 2020, month: 7 },
    category: "湖畔漫步",
    area: "武汉 · 东湖",
    searchName: "东湖生态旅游风景区",
    locationPending: true,
    x: 78,
    y: 45,
    description: `天依城市巡礼系列最后一站

2020年的开场一波三折，城市与城市的往来被迫切断，人们被困在漫长的假期中，然而有形的路虽然断了，无形的“线”却依然连接了四面八方的愿望，给予我们坚持和拼搏的力量。

城市巡礼的最后一站，是这座大家熟悉的城市—武汉。今年三月天依也曾随芭莎来到这里，跟大家分享樱花盛开的春景，祝愿“春暖花开，山河不变”，此次再次来到这座城市，感觉又有所不同。

夏季炎炎，漫步在湖畔，聆听着不时会传到耳边的人声与汽车声，天依知道这座城市正在恢复活力，虽然口罩还是覆盖了人们大半脸庞，却依旧能感受到笑容。

缘分将我们牢牢相系，在最困难的时候给彼此支持的勇气。

8周年的城市之旅已是最后一站，但并不意味结束，而是崭新的开始，相信明天过后，还有无数的你们所在的地方等我前去。`,
    tip: "东湖范围较大，具体打卡位置与入口待补充。出发前请在高德中选择实际目的地。",
    address: "武汉东湖风景区（具体打卡位置与入口待补充）",
    theme: "river",
  },
  {
    id: "gutian-bridge",
    name: "古田桥",
    en: "GUTIAN BRIDGE",
    memoryDate: { year: 2026, month: 10 },
    category: "江岸漫步",
    area: "武汉 · 汉江",
    searchName: "古田桥",
    x: 20,
    y: 47,
    description:
      "在古田桥边停留片刻，把桥影、江风与这次相聚的期待，记在 2026 年 10 月。",
    tip: "请从合法开放的江岸或人行区域观景，具体岸侧与步行入口需在出发前确认。",
    address: "武汉市汉江古田桥（具体到访岸侧与入口待确认）",
    theme: "river",
  },
];
export const chronologicalSpots = [...spots].sort(
  (a, b) =>
    a.memoryDate.year - b.memoryDate.year ||
    a.memoryDate.month - b.memoryDate.month,
);
export function spotDateLabel(spot: Spot) {
  return `${spot.memoryDate.year}年${spot.memoryDate.month}月`;
}
export function spotDateValue(spot: Spot) {
  return `${spot.memoryDate.year}-${String(spot.memoryDate.month).padStart(2, "0")}`;
}
export function spotSearchUrl(spot: Spot) {
  const query = new URLSearchParams({
    keyword: [spot.searchName || spot.name, spot.matchAddress]
      .filter(Boolean)
      .join(" "),
    city: "武汉",
    view: "list",
    src: "jiangcheng-encore",
    callnative: "1",
  });
  return `https://uri.amap.com/search?${query.toString()}`;
}
export const notices = [
  {
    id: "welcome",
    title: "欢迎来到江城 Encore",
    tag: "站点公告",
    date: "演示内容",
    text: `当前收录 ${spots.length} 个指定打卡点，按 2020、2023、2025、2026 年的记忆分类，并提供服务站、应援花篮和海底捞活动入口。活动具体安排待公布，花篮首条为展示示例；地点入口与未确认分店请在高德中核实后再导航。`,
  },
  {
    id: "travel",
    title: "出发前，先收好这份出行清单",
    tag: "出行提示",
    date: "演示内容",
    text: "提前查看主办方的入场须知，确认票证、安检要求及场馆入口。国博应核对具体展馆，奥体应核对具体场馆，餐厅应核对分店。为散场预留交通时间。",
  },
  {
    id: "map",
    title: "地图使用小贴士",
    tag: "使用指南",
    date: "演示内容",
    text: "探索地图页固定为 3D 俯瞰，支持地点筛选；首页和地点详情也采用武汉范围的 3D 地图。未确认地点暂不标注，详情页可打开高德搜索并选择实际门店、场馆或入口，再开始导航。",
  },
];
