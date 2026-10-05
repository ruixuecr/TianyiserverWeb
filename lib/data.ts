export type SpotImage = { src: string; alt: string };
export type Spot = {
  id: string;
  name: string;
  en: string;
  category: string;
  area: string;
  // Only populate after confirming the actual GCJ-02 POI; schematic x/y are independent.
  position?: [number, number];
  x: number;
  y: number;
  description: string;
  tip: string;
  address: string;
  theme: string;
  searchName?: string;
  thumbnail?: SpotImage;
  featuredImage?: SpotImage;
};
export const spots: Spot[] = [
  {
    id: "lawson-guangsha",
    featuredImage: {
      src: "/images/spots/lawson-guangsha.png",
      alt: "中百罗森广厦华庭店主题装饰",
    },
    name: "中百罗森(广厦华庭店)",
    en: "LAWSON · GUANGSHA HUATING",
    category: "街角小店",
    area: "光谷片区",
    x: 75,
    y: 59,
    description:
      "把街角的小店也收进旅程。到广厦华庭店留下一张合照，再带着好心情奔赴下一站。",
    tip: "请认准广厦华庭店；拍照时请勿遮挡店门或影响顾客通行，营业与店内活动以门店信息为准。",
    address: "武汉市光谷片区广厦华庭（具体门牌待核实）",
    theme: "shop",
  },
  {
    id: "yingwuzhou-bridge",
    featuredImage: {
      src: "/images/spots/yingwuzhou-bridge.png",
      alt: "鹦鹉洲大桥主题打卡图片",
    },
    name: "鹦鹉洲大桥",
    en: "YINGWUZHOU YANGTZE RIVER BRIDGE",
    category: "江岸漫步",
    area: "汉阳 / 武昌",
    x: 43,
    y: 63,
    description:
      "把橘红色的桥塔、江面和晚风一起装进相册。在江岸停一停，留下属于武汉的记忆。",
    tip: "请选择合法开放的江岸或人行区域拍照。两岸观景点不同，请在高德中确认想去的岸侧与入口。",
    address: "武汉市汉阳区与武昌区之间的长江江面",
    theme: "river",
    searchName: "鹦鹉洲长江大桥",
  },
  {
    id: "tianbao",
    featuredImage: {
      src: "/images/spots/tianbao.png",
      alt: "天宝饭庄主题打卡图片",
    },
    name: "天宝饭庄",
    en: "TIANBAO RESTAURANT",
    category: "美食探店",
    area: "武汉 · 门店待确认",
    x: 32,
    y: 37,
    description:
      "给旅程留一顿好好吃饭的时间。和同行的人围坐一桌，把期待与快乐都聊进烟火气里。",
    tip: "具体分店尚待确认。请先在高德搜索店名，核对门店地址、营业时间与是否需要预约。",
    address: "武汉市（具体分店及地址待确认）",
    theme: "food",
  },
  {
    id: "bagong-house",
    featuredImage: {
      src: "/images/spots/bagong-house.png",
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
    featuredImage: {
      src: "/images/spots/guobo.webp",
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
    name: "奥体",
    en: "OLYMPIC SPORTS CENTER",
    category: "演出场馆",
    area: "武汉 · 场馆待确认",
    x: 83,
    y: 78,
    description:
      "把热爱带到现场，把合唱留给夜空。提前核对具体场馆，让这场奔赴从容一点。",
    tip: "湖北省奥体中心与光谷国际网球中心是相邻的不同场馆，当前尚待确认你要去的具体地点。",
    address: "武汉市（具体奥体场馆待确认）",
    theme: "stage",
  },
  {
    id: "hubei-museum",
    featuredImage: {
      src: "/images/spots/hubei-museum.png",
      alt: "湖北省博物馆主题设计图片",
    },
    name: "湖北省博物馆",
    en: "HUBEI PROVINCIAL MUSEUM",
    category: "文化场馆",
    area: "武昌区",
    x: 69,
    y: 34,
    description:
      "在编钟与荆楚历史之间，听见另一种声音。给演唱会之外的武汉，再留一段安静的时光。",
    tip: "出发前请通过湖北省博物馆官方渠道查看预约要求、开放时间与入馆安排。",
    address: "武汉市武昌区东湖路160号",
    theme: "museum",
  },
];
export const categories = [
  "全部地点",
  ...new Set(spots.map((s) => s.category)),
];
export function spotSearchUrl(spot: Spot) {
  const query = new URLSearchParams({
    keyword: spot.searchName || spot.name,
    city: "武汉",
    view: "list",
    src: "jiangcheng-encore",
    callnative: "1",
  });
  return `https://uri.amap.com/search?${query.toString()}`;
}
export const events = [
  {
    id: "weekend",
    title: "把周末，交给现场",
    label: "演出灵感",
    date: "DEMO / 示例活动",
    description:
      "国博与奥体，收好你关心的场馆。具体演出安排与入口以主办方公告为准。",
    theme: "stage",
    spotIds: ["guobo", "aoti"],
  },
  {
    id: "sunset",
    title: "日落之前，江边见",
    label: "城市漫游",
    date: "DEMO / 示例路线",
    description:
      "巴公房子 → 鹦鹉洲大桥。从红砖街角到江边晚风，记得为跨江交通留足时间。",
    theme: "river",
    spotIds: ["bagong-house", "yingwuzhou-bridge"],
  },
  {
    id: "walk",
    title: "一张地图，慢游江城",
    label: "打卡计划",
    date: "DEMO / 打卡灵感",
    description:
      "湖北省博物馆、中百罗森广厦华庭店、天宝饭庄。把文化、街角与烟火气收藏进旅程，按距离安排顺序。",
    theme: "house",
    spotIds: ["hubei-museum", "lawson-guangsha", "tianbao"],
  },
];
export const notices = [
  {
    id: "welcome",
    title: "欢迎来到江城 Encore",
    tag: "站点公告",
    date: "演示内容",
    text: "当前收录 7 个指定打卡点。活动为示例内容，示意地图不代表真实位置；地点入口与未确认分店请在高德中核实后再导航。",
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
    text: "探索地图页固定为 3D 俯瞰，支持地点筛选；地点详情的附近地图保留 2D / 3D 切换。当前点位位置为交互示意，详情页可打开高德搜索并选择实际门店、场馆或入口，再开始导航。",
  },
];
