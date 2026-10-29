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
    status: "首个花篮信息已更新",
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
export const basketLocations = {
  popup: "快闪店 武汉伟星星悦广场 LG大中庭",
  stadium: "湖北奥林匹克体育中心体育馆",
} as const;
export type FlowerBasket = {
  id: string;
  name: string;
  description: string;
  location: keyof typeof basketLocations;
  images: ActivityMedia[];
  giveawayImage?: ActivityMedia;
  groupQr?: ActivityMedia;
  groupNote: string;
};
export type BasketSlot = { number: number; basket?: FlowerBasket };

// The user supplied images and the first basket's venue. Other slots stay empty.
const firstBasket: FlowerBasket = {
  id: "basket-01",
  name: "1号应援花篮",
  description:
    "在快闪店相遇，把热爱写进花里。这里收录花篮详细图与无料展示。",
  location: "popup",
  images: [
    {
      src: "/images/activities/basket-01-details.jpg",
      width: 428,
      height: 1280,
      alt: "1号应援花篮详细图：时间魔女主题众筹感谢长图",
    },
  ],
  giveawayImage: {
    src: "/images/activities/basket-01-giveaway.jpg",
    width: 1280,
    height: 663,
    alt: "1号应援花篮无料展示：时间魔女角色与钢琴主题图",
  },
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
