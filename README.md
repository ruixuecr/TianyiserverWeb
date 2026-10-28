# 江城 Encore · 武汉演唱会漫游 Demo

技术栈：Next.js App Router、React、TypeScript、Tailwind CSS 4。数据位于 `lib/data.ts`，当前 7 个示例地点，无数据库。

## 本次验证

- 生产构建与 TypeScript 检查通过。
- 首页、地图、地点详情、活动列表与详情、通知列表与详情 HTTP 200。
- 浏览器实际检查：地点搜索、场馆分类筛选、点位预览、详情跳转、2D 视角切换。
- 初版已检查 390px 手机视口；更新地点后重新检查地图与长店名布局。
- 高德真实地图与手机导航唤起尚未验证，需要配置有效凭据后完成。

## 启动

```powershell
npm install
npm run dev
```

打开 http://localhost:3000 。验证：`npm run typecheck`、`npm run build`。

页面：首页 `/`，地图 `/map`，地点 `/spots/[id]`，活动 `/events`，通知 `/notices`，均有独立详情页。

## 高德配置

复制 `.env.example` 为 `.env.local`，填写 Web 端 JS API Key 与对应安全密钥，重启开发服务。

```dotenv
NEXT_PUBLIC_AMAP_KEY=你的Web端JSAPIKey
AMAP_SECURITY_CODE=对应安全密钥
```

安全密钥仅在服务端使用，通过 `/_AMapService`（重写到 `/api/amap`）代理高德 REST 请求。不要给安全密钥加 NEXT_PUBLIC 前缀。Key 的域名配置应覆盖实际运行域名。代理仅允许固定高德 REST 主机和版本路径，上线前需增加限流与配额监控；不要提交 `.env.local`。

未配置 Key、地图 SDK 加载失败时使用明确标识的 SVG 交互示意图。示意图的 3D 是透视预览，不是高德真实三维地图，也不是武汉行政区边界。真实模式采用 `viewMode: '2D' / '3D'` 重建实例并保留相机中心和缩放；三维模式 pitch=52、rotation=-18。楼块展示取决于区域数据和缩放级别，推荐放大到街区级观察。

## 接口选型

| 接口                                  | 用途                         | 状态                             |
| ------------------------------------- | ---------------------------- | -------------------------------- |
| AMap.Map，viewMode / pitch / rotation | 2D 平面、3D 倾斜俯瞰         | 已接入，需 Key 验证              |
| AMap.Marker / click                   | 7 个点位、点击详情卡片      | 已接入                           |
| AMap.Scale                            | 真实地图比例尺               | 已接入                           |
| URI navigation / marker               | 路线规划、在高德查看地点周边 | 已接入外链                       |
| AMap.DistrictSearch + Polygon / mask  | 武汉行政区边界与聚焦         | 可作为下一步，当前未接入         |
| AMap.Buildings                        | 街区级楼块自定义样式         | 当前使用默认楼块，未自定义       |
| AMap.PlaceSearch                      | 搜索附近餐饮、地铁等真实 POI | 暂不需要，当前搜索仅筛选本地地点 |
| AMap.Geolocation                      | 定位与附近地点排序           | 暂不需要，网站不主动请求定位     |
| AMap.Walking / Transfer / Driving     | 站内详细路线规划             | 暂不需要，交给高德 URI           |

参考图的立体行政区底座、挤出侧壁属于定制可视化，不等同于普通 3D 楼块地图。当前实现为浅色地图倾斜俯瞰，不宣称实现精确行政区沙盘。

官方资料：

- https://lbs.amap.com/api/javascript-api-v2/summary
- https://lbs.amap.com/demo/javascript-api-v2/example/3d/map3d
- https://lbs.amap.com/demo/javascript-api-v2/example/personalized-map/building-style/
- https://developer.amap.com/api/javascript-api-v2/guide/abc/jscode
- https://lbs.amap.com/api/uri-api/guide/travel/route

## 演示范围

地图选中地点后，上方独立图片卡片使用 `featuredImage: { src, alt }`，下方信息卡片小图使用 `thumbnail: { src, alt }`，两张图可分别配置在 `lib/data.ts`。图片建议放入 `public/images/spots/`，src 使用 `/images/spots/文件名.jpg`。未配置或图片加载失败时展示地点插画。关闭、搜索或更换分类会同时收起两张卡片。

点位更新：中百罗森(广厦华庭店)、鹦鹉洲大桥、天宝饭庄、巴公房子、国博、奥体、武汉博物馆。国博按武汉国际博览中心；天宝饭庄分店和奥体具体场馆等待用户确认。首页计数与筛选分类从数据自动派生，活动通过 spotIds 关联地点。

核对资料：中百集团 https://www.whzb.com/archive/2235.html （仅证实广厦华庭店历史记录，不代表当前门牌或营业状态）；武汉市政府桥梁介绍 https://www.wuhan.gov.cn/ztzl/25zt/qiao/ywzzjdq/index.shtml ；武汉博物馆 https://wlj.wuhan.gov.cn/zfxxgk/fdzdgknr/jgjj/zsdw/202008/t20200827_1437246.shtml 。高德名称搜索参数 https://lbs.amap.com/api/uri-api/guide/search/search 。

所有活动、通知为示例文案。地点已替换为用户指定的 7 处。精确 POI 尚未核实，未填写经纬度；SVG 上的 x/y 仅控制示意布局。高德真实底图只渲染已核实并填入 position 的点位；未核实点位通过详情页进入高德名称搜索，由访客确认门店、场馆或入口后导航。插画和示意图是项目自有 SVG 组件。收藏只保留在当前页面状态，不涉及账号或持久化。真实高德调用仍需要有效 Key、安全密钥与网络；未提供 Key 时无法验证真实地图鉴权、楼块与客户端导航唤起效果。
