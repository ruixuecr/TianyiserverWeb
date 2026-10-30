import type { SpotImage } from "./data";

export type ActivityKind = "service-station" | "flower-baskets" | "haidilao";
export const activities: {
  id: ActivityKind;
  title: string;
  status: string;
}[] = [
  {
    id: "service-station",
    title: "服务站活动",
    status: "10月30日 · 10:00–17:00",
  },
  {
    id: "flower-baskets",
    title: "应援花篮活动",
    status: "首个花篮信息已更新",
  },
  {
    id: "haidilao",
    title: "海底捞活动",
    status: "门店安排待公布",
  },
];

export type ActivityMedia = SpotImage & { caption?: string };
export type Giveaway = {
  name: string;
  description?: string;
  image?: ActivityMedia;
};
export const basketLocations = {
  popup: "快闪店 武汉伟星星悦广场 LG大中庭",
  stadium: "湖北奥林匹克体育中心体育馆",
} as const;
export type FlowerBasket = {
  id: string;
  name: string;
  location: keyof typeof basketLocations;
  images: ActivityMedia[];
  giveawayImage?: ActivityMedia;
  groupQr?: ActivityMedia;
};
export type BasketSlot = { number: number; basket?: FlowerBasket };

// The user supplied images and the first basket's venue. Other slots stay empty.
const firstBasket: FlowerBasket = {
  id: "basket-01",
  name: "双魔女应援花篮",
  location: "popup",
  images: [
    {
      src: "/images/activities/basket-01-piano.jpg",
      width: 1280,
      height: 663,
      alt: "双魔女应援花篮详细图：时间魔女角色与钢琴主题图",
    },
  ],
  giveawayImage: {
    src: "/images/activities/basket-01-poster.jpg",
    width: 428,
    height: 1280,
    alt: "双魔女应援花篮无料展示：时间魔女主题众筹感谢长图",
  },
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
  locationImages: ActivityMedia[];
  cover: ActivityMedia;
  date: string;
  hours: string;
  giveaways: Giveaway[];
  supplies: Giveaway[];
  collection: string;
} = {
  name: "江城服务站",
  locationImages: [
    {
      src: "/images/activities/service-station-route.jpg",
      width: 1280,
      height: 1059,
      alt: "观众入场动线图，蓝色文字与箭头标注花篮及服务站位置",
      caption: "入场路线与服务站位置",
    },
    {
      src: "/images/activities/service-station-location.jpg",
      width: 830,
      height: 268,
      alt: "服务站现场位置照片，红蓝线标出广场与台阶旁的位置",
      caption: "现场位置示意",
    },
  ],
  cover: {
    src: "/images/activities/service-station-cover.jpg",
    width: 1280,
    height: 790,
    alt: "服务站活动主题图：蓝色星空中的天依时间魔女",
  },
  date: "10月30日",
  hours: "10:00–17:00",
  giveaways: [
    { name: "「纯蓝幻乐」武汉场鲜花卡" },
    { name: "倡议书" },
    { name: "主题镭射票" },
    { name: "双魔女花篮众筹无料" },
    { name: "五校联合花篮众筹无料" },
    { name: "「无界」洛花篮众筹无料" },
  ],
  supplies: [
    { name: "照片打印" },
    { name: "充电站" },
    { name: "免费水" },
  ],
  collection: "领取方式与数量安排待公布。",
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
