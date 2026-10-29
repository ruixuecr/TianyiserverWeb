# Sites 预览

用户于 2026-10-29 明确要求使用 Sites 重新部署预览。沿用 codex/encore-theme-elements 分支，不覆盖 main 或 mapapi。

## 站点与源码

- Site ID：appgprj_6ae2b571b6488191aff989a1a1654416，已写入 .openai/hosting.json；后续更新复用此 ID，不能重复创建。
- 已部署地址：https://tianyi-encore-preview-ruixue.ratsnaiwazcr.chatgpt.site 。
- 新站默认仅所有者访问，不自动改为公开站点。
- GitHub 保留完整 Next.js 源码、原图、构建脚本及项目文档；Sites 源码仓库存放已构建的 Worker，README 记录对应 GitHub 提交。原静态发布历史保留在下文。

## 高德运行时配置

用户随后提供高德凭据并要求配置。两项值已通过 Sites 环境变量接口保存为 secret，环境 revision 为 1；文档与源码只记录变量名，不记录实际值。

- NEXT_PUBLIC_AMAP_KEY：公开的 JS API Key，经 /api/map-config 提供给浏览器；不再写入构建产物。
- AMAP_SECURITY_CODE：仅由服务端向固定高德上游注入 jscode，浏览器、HTML、JS 和 Git 仓库不包含该值。
- /_AMapService/* 和 /api/amap/*：由 Sites Worker 执行与 Next.js 共用的代理逻辑，限制路径和方法、禁用缓存、不跟随上游重定向，超时返回通用错误。

当前适配将原静态页面及压缩资源嵌入 Worker ESM，保持现有 Site ID、地址与私有访问范围。源码 .openai/hosting.json 已移除 static 字段。后续修改环境变量后需重新部署保存版本使 revision 生效；仅更新环境配置不表示现网已经应用。

## 可重复构建

安装锁定依赖 `npm ci`，在本仓库根目录执行：

```sh
node scripts/export-sites-preview.mjs
node scripts/build-sites-worker.mjs
```

输出目录是可替换的生成目录，请勿指向手写源码。脚本在被忽略的 .preview/sites-build 中复制应用，以 Next.js 官方 output: export 模式构建，不改动根目录 next.config.ts。依赖沿用已安装版本；使用 Next.js 带入的 sharp 提前生成质量 75 的响应式 WebP，保留 next/image 的尺寸、优先加载、延迟加载和原比例展示。

第一步输出 .preview/sites-export，仍不复制 .env 文件、不携带任何地图凭据。第二步将页面资源、sites/worker.mjs 和 lib/amap-service.ts 合为 dist/server/index.js，并写入 dist/.openai/hosting.json。Worker 请求时读取 Sites 注入的环境变量。当前 324 项资源、压缩脚本约 8.45 MiB；构建会拒绝超过 10 MiB 的压缩包，后续素材明显增加时需调整资源托管方式，不可静默删减图片。完整 Next.js 服务器版仍可通过 npm run build / npm start 运行。

导出保留活动、10 位花篮和居中弹窗、美食商场筛选、实时时钟、倒计时和彩色进度环。旧 /events/weekend、/events/sunset、/events/walk 使用静态 HTML 跳转至 /events/；这三条仅为兼容入口。

## 发布流程

当前环境缺少 Sites 安装包中的构建与源码 helper，因此使用本仓库脚本生成支持的 Worker ESM 入口，并以 Sites 原生版本与部署接口发布。Site 工作目录为 /workspace/sites/tianyi-encore-preview，包含 dist/ 和与本仓库相同的 .openai/hosting.json。

1. 验证 Worker 后，将生成的 dist/ 替换到 Site 工作目录，同步 .openai/hosting.json 和 README 来源记录；提交并推送至 Sites 返回的专属源码仓库，该仓库与 GitHub 应用仓库分开。
2. 从该提交打包 .openai/hosting.json 和 dist/，传入完整的已推送提交 SHA、项目 ID 和归档路径，保存版本并部署。
3. 检查部署终态，仅 succeeded 且返回 URL 时报告完成。以后复用已保存项目和版本记录。
4. Git 凭据只通过隐藏 stdin 进入进程内存；不写入 URL、仓库配置、文件或日志。后续具备官方 helper 时优先使用 helper。

## 验证记录

2026-10-29：官方静态导出成功；原服务器版 npm run build 与 npm run typecheck 通过。Chromium 检查 5 种宽度（1440、1024、820、390、320px）下的 6 个页面，覆盖花篮弹窗居中、焦点限制、关闭方式、推荐搜索分类、旧活动链接及钟盘层级，无运行或水合错误。这些检查不包括真实高德地图。

额外检查首页、地图、天宝详情、通知列表及正文的可见图片均成功加载预生成 WebP；全站五个导航入口可正常客户端跳转，无 HTTP 资源或页面运行错误。浏览器跳页时主动取消的预取请求不作为资源故障。

## 首次发布结果

- 状态：succeeded；Sites 原生部署接口于 2026-10-29 02:57:59 UTC 返回成功和上述 URL。
- GitHub 应用与导出脚本提交：d46b2a5540478290b22e10d109b7439eac7ba23b；后续交接文档提交不改变该已部署页面。
- Sites 源码提交：02794dbf9fdd08fe0ff67dff28fce8a36941bc71，已与远端 main 分支核对一致。这里的 main 是独立 Sites 仓库分支，与用户要求保护的 GitHub main 无关。
- 版本 ID：appgprj_6ae2b571b6488191aff989a1a1654416~appgver_6f97ff221efc8191a4191d0c837155b8。
- 部署 ID：appgdep_6ae2b624f2a48191b6672dadda4a79e3。
- 归档从上述 Sites 提交直接生成，包含 .openai/hosting.json 与 dist/；原生部署成功作为托管发布证据，交互验证在同一静态产物的本地预览完成。

Sites 预览不依赖旧 Tunnelmole 隧道进程；旧 .preview/url.txt 中的地址不再作为当前入口。上述首次发布是无地图代理的静态历史版本。

## Worker 迁移验证

已通过 npm run build、npm run typecheck；node --test scripts/check-amap-service.mjs 的 5 项检查覆盖公开配置不泄露私密值、路径/方法限制、jscode 覆盖、上游与缓存策略、错误信息脱敏和拒绝上游重定向。构建的 Worker 通过路由、gzip 解压、WebP、404、跳转检查，并在 Chromium 重跑 30 组页面/视口组合与花篮、推荐交互。

首次 Worker 实测代理立即返回 502，已用兼容的 fetch 选项修正：Worker 不传 cache 枚举，以请求 Cache-Control: no-cache 和响应 no-store 禁用缓存；redirect: manual 后显式拒绝 3xx，仍不跟随重定向。Next.js 继续使用 cache: no-store。错误日志移除安全密钥和上游 URL。

## 高德接入部署与实测边界

- 2026-10-29 03:44:33 UTC，Sites 返回 succeeded，环境 revision 1 已生效。
- 应用提交：224a9a6f8eb7d15f0c00a62736828713bbd51ff4；Sites 源码提交：aefa39fdf6ef25bd6dd67a418e75e8057bb72729，已推送并核对远端。
- 版本 ID：appgprj_6ae2b571b6488191aff989a1a1654416~appgver_ef35fda37018819199eca86a3df88850。
- 部署 ID：appgdep_6ae2c1134e608191b229a7c0e10c61d0。
- 线上 /api/map-config 返回 200，仅包含非空公开 Key；高德 SDK 2.0 已加载，武汉行政区查询返回 4 个边界环，PlaceSearch 返回真实结果，代理请求为 200。凭据未写入 GitHub、Sites 源码仓库或浏览器安全配置。
- 云端 Chromium 被 SDK 判定 AMap.Browser.isWebGL=false，基础地图实验实际回退为 pitch 0、rotation 0 的 2D，不能作为真实 3D 成功证据。原初始化遮罩在该降级路径触发 renderFrame 错误；暂时调整遮罩顺序的试验未部署，已保留原 3D/遮罩实现。现在先检查 SDK 的 WebGL 能力，在不支持的浏览器显示明确提示，不静默改用 2D。
- 原配置保持 pitch 52、rotation -18、zoom 11、中心 [114.305,30.56]、完整武汉边界、自定义样式与原标签样式。仍需在高德认可的 WebGL 浏览器核对最终 3D、样式和遮罩效果。
- 原地点精确匹配仍有缺失：两次在线查询出现不同的 3 个匹配标签，并非 7 个标签全部稳定成功。此次配置不固化未经核实的 POI 坐标。
- 最终部署复核：兼容提示正常显示且无浏览器运行错误；通过同页 SDK 独立发起武汉边界查询与中百罗森搜索，均返回 complete，分别为 4 个边界环与 1 条 POI 结果。

此次仅配置了 Sites 托管运行环境；云端本地 .env.local 未保存用户凭据。后续本地调试若需要真实地图，使用安全环境配置，不从文档获取值。

## 倒计时与地点年份发布

2026-10-29 04:06:58 UTC 原生部署返回 succeeded，沿用原地址、私有权限和高德环境 revision 1。

- 应用提交：f3637c57d201afe6b00f8c43b077dae46bf4f5c3。
- Sites 源码提交：2507ad93bf8bf6956246d9cccb7254e0e6563e3d，已推送并核对远端。
- 版本 ID：appgprj_6ae2b571b6488191aff989a1a1654416~appgver_c2431463d5c0819181e10c2707b649fd。
- 部署 ID：appgdep_6ae2c653fc6c81919e5a87cac1051fc7。

本次包含 2026-10-31 19:12 UTC+8 倒计时、随时针转动的边缘倒计时环、默认开启动效且移除开关，以及 9 个地点的年份筛选和年月标签。新增东湖/古田桥详情，奥体归入 2026-10。

验证：npm run build、npm run typecheck、3 项倒计时边界测试通过。Chromium 在美国时区验证北京时间目标、累计小时、每秒递减、环与时针同角度、开场归零，以及旧动效关闭偏好失效和系统减少动画仍生效。1440/1100/1024/820/390/320px 下检查年份计数（2/1/3/3）、9 条年月、搜索/空结果恢复、选择取消、弹层和导航宽度；新地点详情链接通过。实际 Worker 包另测路由、筛选和倒计时弹层，无浏览器运行错误。地图 3D/POI 验证限制沿用上节，新地点照片与具体入口待补充。

## 彩色时环与首篮资料更新

时钟下方已恢复北京时间与当前日期；顶部/外环继续显示开场倒计时。彩色环按 12 小时一圈消退一层，到点全部移除；首篮使用最新图 3 为单张无料、图 4 为详细长图，摆放在快闪店 武汉伟星星悦广场 LG大中庭。花篮摆放位置限制为快闪店或湖北奥林匹克体育中心体育馆，不再显示活动时间和发起人，二维码仍待补。

2026-10-29 验证：npm run build、npm run typecheck 通过，5 项时间边界测试通过。实际 Worker 发布包在 Chromium 的 1440/820/390/320px 下检查：美国时区中正确显示北京时间、每圈少一色、刷新保留进度、最后一秒与归零后持续报时、系统减少动画、10 个花篮位与两处地点、删除字段、单张无料和长图 WebP 原比例、弹窗内部滚动及 Escape/焦点恢复；无横向溢出或页面运行错误。浏览器 QA 和截图位于忽略的 .preview/，两张原图及来源说明随应用仓库同步。高德实现与验证边界沿用前文。

发布结果：2026-10-29 04:46:54 UTC，原生 Sites 接口返回 succeeded；现有网址、私有权限与高德环境 revision 1 保持。

- 应用提交：f044332437f62fa29d115413e551f82f58cfb44a，已推送并核对 GitHub。
- Sites 源码提交：9cd2f1d93fadcc7e5b71878eb86b0ca9b0946ae7，已推送并核对专属源仓库。
- 版本 ID：appgprj_6ae2b571b6488191aff989a1a1654416~appgver_2486a85d00948191a7bee5605ec5f737。
- 部署 ID：appgdep_6ae2cfb1226081919253dfa865ae55f9。
- 发布归档从上述 Sites 提交生成；完成后停止云端本地 QA 服务，线上预览不依赖该进程。

## 倒计时文字固定在上方

2026-10-29 按用户要求将外缘文字移出旋转分组，固定于钟面正上方；文字数字持续更新，彩色环继续与时针同步消退，下方正常报时。npm run build、npm run typecheck 通过；实际 Worker 包在 1440/390/320px 下验证文字居中与固定方向，模拟前进一小时后位置不变，数字、时针和彩色环正常更新，无溢出或浏览器运行错误。

发布结果：2026-10-29 21:19:14 UTC，Sites 返回 succeeded；地址、私有权限和高德环境 revision 1 沿用。

- 应用提交：a846689f2240f770b9be59fe03ff8167737c345c，已与 GitHub 核对。
- Sites 源码提交：f4fe7accd3993907bf459e9b487750b6e2deb7fe，已与远端核对。
- 版本 ID：appgprj_6ae2b571b6488191aff989a1a1654416~appgver_f80082f1c1548191abcd8b587e7d5ed2。
- 部署 ID：appgdep_6ae3b84448508191aefa58e82ae38ab4。
