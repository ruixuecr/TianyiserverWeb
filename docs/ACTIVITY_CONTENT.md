# 活动资料填写与验收入口

适用分支：codex/encore-theme-elements。页面已可预览，活动真实资料尚未提供；不要把展示示例当成已公布的活动安排。

## 核对页面

| 地址 | 核对内容 |
| --- | --- |
| /events | 恰好三个入口：服务站活动、应援花篮活动、海底捞活动 |
| /events/flower-baskets | 10 个展示位，其中 1 个示例可点击、9 个等待补充 |
| 花篮弹窗 | 屏幕居中；详细图、无料、花篮交流群；内部滚动；关闭按钮、Escape、点击遮罩关闭；关闭后焦点回到卡片 |
| /events/service-station | 位置、日期、服务/发放时段、无料、物资、领取说明 |
| /events/haidilao | 参与门店、日期、时段、活动内容与参与方式 |
| / | 钟盘在钢琴角色图后方，桌面直径 500px；手机按视口缩放；动效偏好仍有效 |
| /recommendations | 美食/商场筛选、名称/区域搜索、空结果重置、高德选点和天宝攻略链接 |

## 花篮

修改 lib/activities.ts 中的 flowerBaskets 列表。当前只有 firstBasket 一条示例。按顺序添加记录即可填入剩余展示位，最多 10 条；每条 id 保持唯一。

- name、organizer、description：花篮名称、发起人、介绍。
- location、time：真实摆放位置与展示/领取时间。
- images：详细图数组，支持多图；每张填写 src、width、height、alt，可附 caption。保留原始宽高比。
- giveaways：无料数组；每项填写 name、description，可添加 image（同上图片结构）。giveawayNote 填写统一领取说明。
- groupQr：真实群二维码图片（同上图片结构）；未提供时保持省略。二维码按原图交付，不做有损压缩。
- groupNote：入群说明或二维码有效期提醒。
- sample：示例条目设为 true；资料确认并替换后才移除示例标识。

当前“蓝白花语”使用用户提供的花簇参考图，并注明“非花篮实拍”；明信片、小卡为示例品类。没有虚构可扫描的群二维码，也没有已确认发放的无料。

## 服务站与海底捞

在 lib/activities.ts 修改 serviceStation 与 haidilaoActivity：

- location.name / address：站点或参与门店名称、地址。
- location.mapQuery：确认后填写精确地点搜索词，页面才会展示高德选点导航链接；没有确认地点时保持省略。
- date / hours：日期、服务或活动时段。
- serviceStation.giveaways / supplies：无料与物资数组；字段同花篮 giveaways。空数组显示待公布。
- serviceStation.collection：领取方式与数量说明。
- haidilaoActivity.participation：参与方式与现场安排。

这些活动位置独立于 lib/data.ts 的 7 个城市打卡点；不把尚未确认的服务站或门店写成地图坐标。

## 美食商场

lib/recommendations.ts 保存 6 条出行推荐（3 处美食、3 处商场/街区）。填写名称、类别、区域、介绍、标签与精确搜索词；有既有打卡攻略时填写 spotId。推荐不代表活动参与门店，不包含未经核实的营业时间、价格或实时营业状态。

## 图片与更新

活动图片可放在 public/images/activities/，使用新的描述性文件名，并记录原始宽高。普通图片由 next/image 按展示尺寸交付 WebP，弹窗未打开时不请求其中的详情图或二维码；二维码保留原图清晰度。换图应使用新文件名，避免复用旧缓存。

修改完成后执行 npm run build、npm run typecheck，再重启生产预览。临时链接保存在被忽略的 .preview/url.txt；请勿在内容文件放入地图密钥。
