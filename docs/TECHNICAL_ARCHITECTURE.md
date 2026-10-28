# 技术架构与实现细节

更新日期：2026-10-29。以 mapapi 当前代码为准。

## 技术栈与目录

当前已验证版本为 Next.js 16.3.8、React 19；TypeScript、Tailwind CSS 4、lucide-react。依赖声明允许版本范围，实际版本以锁文件为准。数据集中在 TypeScript 文件中，没有数据库。Next.js 服务端承载高德代理，因此完整功能不能仅作为静态 HTML 托管。

| 文件/目录 | 职责 |
| --- | --- |
| app/page.tsx | 简约首页 |
| components/home-city-map.tsx | 首页地图与地点跳转 |
| components/city-map.tsx | 高德 SDK 加载、边界、相机、POI 搜索和标签 |
| components/map-explorer.tsx | 地点搜索分类、选中状态、上下卡片和缩放按钮 |
| components/spot-detail.tsx | 左地图、右介绍、下方图片的详情布局 |
| components/spot-image-card.tsx | 独立图片卡片和图片失败回退 |
| components/art.tsx | 项目内 SVG 插画 |
| lib/data.ts | 地点、活动、通知、分类和高德搜索链接 |
| app/globals.css | 界面、标签及响应式样式 |
| public/images/spots/ | 已入库的地点图片 |
| app/api/amap/[...path]/route.ts | 高德请求代理 |
| next.config.ts | /_AMapService/:path* 到 /api/amap/:path* 的重写 |

## 地图加载与相机

浏览器动态加载高德 JS API 2.0，插件为 AMap.Scale、AMap.PlaceSearch、AMap.DistrictSearch。SDK 和行政区查询 Promise 在模块内缓存；失败后允许重试。SDK 加载超时 15 秒，行政区和 POI 查询超时各 12 秒。

DistrictSearch 查询武汉行政区编码 420100，校验返回编码与轮廓有效性。使用 mask 遮挡武汉以外区域，并以无填充 Polygon 描边。实例固定 viewMode: 3D、pitch: 52、pitchEnable: false、rotation: -18。

- 初始 zoom 为 11，中心为 [114.305, 30.56]。
- 地点选中后缩放至 13；详情附近地图缩放至 16。
- 筛选导致实例重建时缓存相机中心和缩放。
- “查看全城”使用边界多边形 setFitView，首次加载不再调用它。
- 无 Key、加载中、加载失败各有明确状态。当前不使用旧 SVG 底图作为失败回退。

自定义样式：amap://styles/7444edd6e8d1980b3cb81eb2e28dc88a。

## 地点解析与标签

Spot.position 是可选 GCJ-02 经纬度，存在时直接使用。当前地点数据尚未全部固化坐标。x/y 是旧示意布局字段，不能当成真实经纬度。

解析顺序：已有 position → locationPending 则跳过 → PlaceSearch 在武汉范围内检索 searchName 或 name。名称会去除武汉前缀、空格及部分标点，仅接受唯一匹配且有有效坐标的结果。

天宝使用 matchAddress: 苗栗路12号；既接受完全同名，也接受带括号分店后缀的名称，但必须同时匹配地址。奥体查询完整名称“湖北省奥林匹克体育中心体育馆西门”，不降级到整个场馆中心。缓存键包含搜索名称和地址，失败结果清除缓存；缓存只在当前 JS 会话内保留，不是持久坐标库。

仅解析成功的地点生成 Marker。未解析地点列入左下角提示。搜索超时、重名、名称不一致会导致标签缺失；视野和列表筛选也可能影响可见标签数。

Marker 内容用 DOM 创建，名称写入 textContent；外观沿用原有图钉、浅底名称和选中态，倾斜标签约旋转 -8 度。标签点击停止冒泡；地图背景点击调用取消选择回调。

## 导航与状态范围

详情组件根据原始 spot.position 决定导航链接：有坐标时打开高德步行导航，否则打开关键词搜索；天宝搜索链接包含地址约束。浏览器内部 POI 查询结果目前没有回传给详情组件以更新该外链，所以地图已定位不代表详情链接自动变成坐标导航。

类别、搜索和选中状态位于客户端组件内；没有跨设备保存机制。当前不实现站内完整路线规划或主动用户定位。

## 配置与代理

| 变量 | 说明 |
| --- | --- |
| NEXT_PUBLIC_AMAP_KEY | 高德 Web JS API Key，客户端构建时使用；更换后需重新构建/启动。 |
| AMAP_SECURITY_CODE | 服务端安全密钥，由代理注入 jscode；不得加 NEXT_PUBLIC_ 前缀。 |

代理仅接收 v3/v4/v5 开头且符合字符规则的路径；样式 v4/map/styles 指向 webapi.amap.com，其他路径指向 restapi.amap.com。覆盖调用方的 jscode，不跟随重定向，超时 10 秒。上游请求与响应均禁用缓存。当前是主机和路径格式约束，不是逐接口白名单，尚无业务级鉴权或限流。

缺少安全密钥返回 503；上游异常返回 502。Web JS Key 不能直接当成 Web 服务 Key 使用，先前直接 REST 查询得到 USERKEY_PLAT_NOMATCH，不可据此断言浏览器 SDK 也不可用。

高德编辑器“保存成功”、样式接口成功和浏览器渲染最新版是不同证据，样式更新必须在实际客户端验证。

## 时光主题分支的增量结构

codex/encore-theme-elements 在 mapapi 基线上新增以下模块：

| 文件 | 职责 |
| --- | --- |
| components/time-theme.tsx | Shell 内主题容器、动效偏好 Context、武汉实时钟及设置弹层 |
| components/theme-artwork.tsx | 首页主视觉和可复用的飘带、花瓣、音符、环形装饰 |
| components/ui/popover.tsx | Radix UI Popover 的 Portal、碰撞避让与样式封装 |
| components/ui/switch.tsx | Radix UI Switch 开关封装 |
| app/theme.css | 以 encore-theme 为范围的全站色板、主题样式、钟面、动效和手机布局 |
| public/images/theme/ | 用户本次参考图原文件及编号映射 |

新增依赖为 @radix-ui/react-popover 1.3.1、@radix-ui/react-switch 1.4.1。服务端与客户端首次渲染均使用时间占位符，挂载后按秒更新，并以 Intl 的 Asia/Shanghai 时区格式化，避免时区差异引起水合错误。计时器在卸载时清理；时间更新限于时钟组件。

各页面在 encore-theme 容器内共享首页色板；原 paper/ink/muted/green/line/mint/orange 变量映射到蓝白、淡金主题，旧变量名 green/orange 仅为兼容现有样式。地图侧栏、加载状态、卡片、按钮与通知图标的历史硬编码配色也在主题层覆盖。components/art.tsx 的 SVG 填色使用 art-* CSS 变量并保留原色回退，由主题容器提供蓝金色板；不对照片使用滤镜，不覆盖高德自定义样式或图钉标签规则。

仅装饰动效偏好保存在 localStorage 的 encore-theme-motion，存储不可用时仍可在当前页面切换；prefers-reduced-motion 优先关闭装饰动画。地点筛选与选择仍不持久化。弹层由 Radix 处理焦点、Escape 关闭和移动端位置；装饰图片使用空 alt、aria-hidden 和 pointer-events: none。

此次没有修改 CityMap、SpotDetail、地点数据或高德代理。完整构建、独立类型检查、桌面与手机浏览器交互检查通过；浏览器检查覆盖跨时区报时、弹层焦点、动效保存、减少动态效果、地点搜索/选择及长图比例，不包含缺少凭据的真实高德地图。
