# 活动资料填写与验收入口

适用分支：codex/encore-theme-elements。页面已可预览，首篮图片与摆放位置已由用户提供；服务站位置示意、日期时段和三项现场服务也已提供；群二维码、其他花篮、服务站无料及海底捞安排仍待补充。

用户要求不擅自添加内容。活动与花篮不再展示自行补充的介绍或装饰口号；内容只按用户提供或明确确认的资料填写，缺项保留简短状态或省略，不编造宣传文案。

## 核对页面

| 地址 | 核对内容 |
| --- | --- |
| /events | 恰好三个入口：服务站活动、应援花篮活动、海底捞活动 |
| /events/flower-baskets | 10 个展示位，其中 1 个已填可点击、9 个等待补充 |
| 花篮弹窗 | 屏幕居中；详细图、单张无料长图、摆放位置、花篮交流群；内部滚动；关闭按钮、Escape、点击遮罩关闭；关闭后焦点回到卡片 |
| /events/service-station | p2/p3 位置示意图、10月30日 10:00–17:00、照片打印/充电站/免费水，p6 封面；无料与领取说明待补充 |
| /events/haidilao | 参与门店、日期、时段、活动内容与参与方式 |
| / | 钟盘在钢琴角色图后方，桌面直径 500px；手机按视口缩放；动效默认开启并尊重系统减少动画设置 |
| /recommendations | 美食/商场筛选、名称/区域搜索、空结果重置、高德选点和天宝攻略链接 |

## 花篮

修改 lib/activities.ts 中的 flowerBaskets 列表。当前只有 firstBasket 一条，页面名称为“双魔女应援花篮”。按顺序添加记录即可填入剩余展示位，最多 10 条；每条 id 保持唯一。

- name：用户确认的花篮名称；已移除 description 字段，不另行生成介绍。
- location：只能填写 basketLocations 的 popup 或 stadium。对应“快闪店 武汉伟星星悦广场 LG大中庭”与“湖北奥林匹克体育中心体育馆”；首篮为 popup。不要添加第三种地点，不填写尚未确认的具体坐标。
- images：详细图数组；每张填写 src、width、height、alt，可附 caption。首篮按最新纠正采用原图 3 横版钢琴角色图，1280×663，路径 /images/activities/basket-01-piano.jpg；活动列表、活动详情页与花篮卡片的封面也共用这张详细图。
- giveawayImage：无料只放一张展示图，同样填写 src、width、height、alt。首篮按最新纠正采用原图 4 竖版长图，428×1280，路径 /images/activities/basket-01-poster.jpg。不要重建明信片、小卡的示例列表或从海报推测发放清单。
- groupQr：真实群二维码图片；未提供时保持省略。二维码按原图交付，不做有损压缩。

用户已要求移除花篮活动时间与发起人，FlowerBasket 类型中不再保留 time / organizer。两张素材只按指定用途展示，长图中的众筹金额不扩展成站内支付功能或无料领取条件。群二维码尚未提供，不虚构可扫描值。

## 服务站与海底捞

在 lib/activities.ts 修改 serviceStation 与 haidilaoActivity：

- serviceStation.locationImages：位置示意图数组，本次 p2 为 /images/activities/service-station-route.jpg（1280×1059），p3 为 /images/activities/service-station-location.jpg（830×268），都可打开原图。
- serviceStation.cover：活动列表与详情共用封面，本次 p6 为 /images/activities/service-station-cover.jpg（1280×790），保留完整比例。
- haidilaoActivity.location.name / address：参与门店名称、地址。
- haidilaoActivity.location.mapQuery：确认后填写精确地点搜索词，页面才会展示高德选点导航链接；没有确认地点时保持省略。
- date / hours：日期、服务或活动时段；服务站已确认 10月30日、10:00–17:00，服务时间卡只展示这两项。
- serviceStation.giveaways / supplies：无料与物资数组；每项填写 name，可附用户提供的 description 和 image；与花篮单图字段分开。空数组显示待公布。服务站 supplies 已填照片打印、充电站、免费水，giveaways 仍留空。
- serviceStation.collection：领取方式与数量说明。
- haidilaoActivity.participation：参与方式与现场安排。

这些活动位置独立于 lib/data.ts 的 9 个城市打卡点；不把尚未确认的服务站或门店写成地图坐标。

## 美食商场

lib/recommendations.ts 保存 6 条出行推荐（3 处美食、3 处商场/街区）。填写名称、类别、区域、标签与精确搜索词；已移除自拟 description；有既有打卡攻略时填写 spotId。推荐不代表活动参与门店，不包含未经核实的营业时间、价格或实时营业状态。

## 图片与更新

活动图片可放在 public/images/activities/，使用新的描述性文件名，并记录原始宽高。普通图片由 next/image 按展示尺寸交付 WebP，弹窗未打开时不请求其中独有的无料图或二维码；首篮详细图同时作为活动封面，会随可见封面加载；二维码保留原图清晰度。换图应使用新文件名，避免复用旧缓存。

修改完成后执行 npm run build、npm run typecheck，按 SITES_PREVIEW.md 更新现有 Sites 预览；旧临时隧道不再使用。请勿在内容文件放入地图密钥。
