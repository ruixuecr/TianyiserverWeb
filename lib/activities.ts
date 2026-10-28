import type { SpotImage } from "./data";

export type ActivityKind = "service-station" | "flower-baskets" | "haidilao";
export const activities: {
  id: ActivityKind;
  title: string;
  english: string;
  description: string;
  status: string;
}[] = [
  {
    id: "service-station",
    title: "服务站活动",
    english: "A LITTLE HELP, A LOT OF LOVE",
    description:
      "找到同行的伙伴，也收下为你准备的一份心意。站点位置、无料与物资，在这里查看。",
    status: "站点安排待公布",
  },
  {
    id: "flower-baskets",
    title: "应援花篮活动",
    english: "LET OUR LOVE BLOOM",
    description: "把热爱写进花里。查看每一份花篮心意、随篮无料与同好交流群。",
    status: "首个花篮展示示例",
  },
  {
    id: "haidilao",
    title: "海底捞活动",
    english: "ONE MORE GATHERING",
    description: "把相聚的时间再延长一点。关注参与门店、活动时段与现场安排。",
    status: "门店安排待公布",
  },
];

export type ActivityMedia = SpotImage & { caption?: string };
export type Giveaway = {
  name: string;
  description: string;
  image?: ActivityMedia;
};
export type FlowerBasket = {
  id: string;
  name: string;
  organizer: string;
  description: string;
  location: string;
  time: string;
  sample?: boolean;
  images: ActivityMedia[];
  giveaways: Giveaway[];
  giveawayNote: string;
  groupQr?: ActivityMedia;
  groupNote: string;
};
export type BasketSlot = { number: number; basket?: FlowerBasket };

// Only the first slot contains a clearly labelled preview. Replace it with confirmed content.
const firstBasket: FlowerBasket = {
  id: "blue-white-preview",
  name: "蓝白花语",
  organizer: "发起人待公布",
  description:
    "以蓝白花簇与音乐为灵感，把一份温柔的心意留在现场。此条为展示示例，实际花篮设计与活动信息待确认。",
  location: "花篮摆放位置待公布",
  time: "展示与领取时间待公布",
  sample: true,
  images: [
    {
      src: "/images/theme/blue-blossoms.jpg",
      width: 1280,
      height: 663,
      alt: "蓝白花簇主题参考图，非实际花篮照片",
      caption: "主题参考图 · 非花篮实拍",
    },
  ],
  giveaways: [
    { name: "主题明信片", description: "示例品类，实际款式与数量待公布。" },
    { name: "纪念小卡", description: "示例品类，领取方式待公布。" },
  ],
  giveawayNote: "以上为无料展示示例，尚未确认发放安排。",
  groupNote: "花篮群二维码待补充，公布后可在这里查看。",
};
export const flowerBaskets: FlowerBasket[] = [firstBasket];
export const basketSlots: BasketSlot[] = Array.from(
  { length: 10 },
  (_, index) => ({
    number: index + 1,
    basket: flowerBaskets[index],
  }),
);

export type ActivityLocation = {
  name: string;
  address: string;
  mapQuery?: string;
};
export const serviceStation: {
  name: string;
  location: ActivityLocation;
  date: string;
  hours: string;
  giveaways: Giveaway[];
  supplies: Giveaway[];
  collection: string;
} = {
  name: "江城服务站",
  location: {
    name: "服务站位置待公布",
    address: "具体地址与领取点位将在确认后更新。",
  },
  date: "活动日期待公布",
  hours: "服务与发放时段待公布",
  giveaways: [],
  supplies: [],
  collection: "领取方式与数量安排待公布，请留意站点后续更新。",
};
export const haidilaoActivity = {
  location: {
    name: "参与门店待公布",
    address: "活动门店与详细地址将在确认后更新。",
  } as ActivityLocation,
  date: "活动日期待公布",
  hours: "活动时段待公布",
  participation: "参与方式、现场环节与门店安排待公布。",
};

export function placeSearchUrl(keyword: string) {
  const query = new URLSearchParams({
    keyword,
    city: "武汉",
    view: "list",
    src: "jiangcheng-encore",
    callnative: "1",
  });
  return `https://uri.amap.com/search?${query.toString()}`;
}
