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

第一步输出 .preview/sites-export，仍不复制 .env 文件、不携带任何地图凭据。第二步将页面资源、sites/worker.mjs 和 lib/amap-service.ts 合为 dist/server/index.js，并写入 dist/.openai/hosting.json。Worker 请求时读取 Sites 注入的环境变量。当前 290 项资源、压缩脚本约 7.87 MiB；构建会拒绝超过 10 MiB 的压缩包，后续素材明显增加时需调整资源托管方式，不可静默删减图片。完整 Next.js 服务器版仍可通过 npm run build / npm start 运行。

导出保留活动、10 位花篮和居中弹窗、美食商场筛选、实时钟及主题设置。旧 /events/weekend、/events/sunset、/events/walk 使用静态 HTML 跳转至 /events/；这三条仅为兼容入口。

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

已通过 npm run build、npm run typecheck；node --test scripts/check-amap-service.mjs 的 4 项检查覆盖公开配置不泄露私密值、路径/方法限制、jscode 覆盖、上游与缓存策略及错误信息脱敏。构建的 Worker 通过路由、gzip 解压、WebP、404、跳转检查，并在 Chromium 重跑 30 组页面/视口组合与花篮、推荐交互。

Worker 部署与真实高德结果待发布后记录，不能以构建通过代替真实地图验证。
