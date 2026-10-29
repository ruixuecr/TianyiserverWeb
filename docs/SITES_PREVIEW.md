# Sites 预览

用户于 2026-10-29 明确要求使用 Sites 重新部署预览。沿用 codex/encore-theme-elements 分支，不覆盖 main 或 mapapi。

## 站点与源码

- Site ID：appgprj_6ae2b571b6488191aff989a1a1654416，已写入 .openai/hosting.json；后续更新复用此 ID，不能重复创建。
- 已部署地址：https://tianyi-encore-preview-ruixue.ratsnaiwazcr.chatgpt.site 。
- 新站默认仅所有者访问，不自动改为公开站点。
- GitHub 保留完整 Next.js 源码、原图、构建脚本及项目文档；Sites 源码仓库存放本次导出的 HTML、JS、CSS 和图片，README 记录对应 GitHub 提交。

## 可重复构建

安装锁定依赖 `npm ci`，在本仓库根目录执行：

```sh
node scripts/export-sites-preview.mjs /workspace/sites/tianyi-encore-preview/dist
```

输出目录是可替换的生成目录，请勿指向手写源码。脚本在被忽略的 .preview/sites-build 中复制应用，以 Next.js 官方 output: export 模式构建，不改动根目录 next.config.ts。依赖沿用已安装版本；使用 Next.js 带入的 sharp 提前生成质量 75 的响应式 WebP，保留 next/image 的尺寸、优先加载、延迟加载和原比例展示。

静态预览不运行高德服务端代理，不复制 .env 文件，并明确清空构建时地图凭据。地图显示待接入，地点列表与攻略仍可使用。完整服务器版继续通过 `npm run build` / `npm start` 运行；将来接入真实地图需要兼容服务端运行的托管与安全配置，不能仅向此静态构建加入 Key。

导出保留活动、10 位花篮和居中弹窗、美食商场筛选、实时钟及主题设置。旧 /events/weekend、/events/sunset、/events/walk 使用静态 HTML 跳转至 /events/；这三条仅为兼容入口。

## 发布流程

当前环境缺少 Sites 安装包中的构建与源码 helper，因此使用本仓库的静态导出脚本构建，并以 Sites 原生版本与部署接口发布。Site 工作目录为 /workspace/sites/tianyi-encore-preview，包含 dist/ 和与本仓库相同的 .openai/hosting.json。

1. 验证导出结果后，将 Site 工作目录完整提交并推送至 Sites 返回的专属源码仓库；该仓库与 GitHub 应用仓库分开。
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

Sites 预览不依赖旧 Tunnelmole 隧道进程；旧 .preview/url.txt 中的地址不再作为当前入口。此次发布为私有静态预览，不等于含高德服务端代理的完整站点已上线。
