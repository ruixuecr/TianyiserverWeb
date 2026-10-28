# 本地与云端开发交接

更新日期：2026-10-29。

## 仓库与分支

仓库：https://github.com/ruixuecr/TianyiserverWeb （私有）。当前开发分支 mapapi；默认 main 保留原始 demo。云端拉取默认分支后，必须明确切到 mapapi 再按本套文档继续开发，不更改远端默认分支或覆盖主分支。

最初的两个实验分支 codex/crisp-map-labels 与 codex/svg-tilted-labels 已保留。后续以 Git 的实际提交记录为准。

## 新环境启动

1. 克隆指定分支：git clone --branch mapapi https://github.com/ruixuecr/TianyiserverWeb.git
2. 进入目录：cd TianyiserverWeb
3. 安装锁定依赖：npm ci
4. 构建：npm run build
5. 独立类型检查：npm run typecheck
6. 开发服务：npm run dev

平台已检出仓库时不要重复克隆。使用可满足安装包 engines 的 Node.js；原本机验证运行时为 Node.js 24.14.1，云端可选 Node.js 24 系列后实际运行检查。开发服务绑定 0.0.0.0，默认端口 3000。构建会生成类型文件，因此干净环境先 build，再单独 typecheck。

修改 Next.js 实现前按根目录 AGENTS.md 阅读安装包内指南。本项目不是数据库应用，不需要初始化数据库或运行数据库迁移。

## 地图环境变量

只提交空值模板 .env.example，不提交真实 .env.local。本机已有凭据不代表云端自动继承。

- NEXT_PUBLIC_AMAP_KEY：高德 Web JS API Key，浏览器端需要；更换后重新构建。
- AMAP_SECURITY_CODE：对应安全密钥，必须仅服务端使用。

无地图凭据时可安装依赖、构建和开发其他界面；地图会显示待配置状态。真实地图还需要允许 npm 安装源以及实际高德 SDK、样式、地图资源和代理的网络访问。代理上游主机为 restapi.amap.com 与 webapi.amap.com；其他客户端资源域名按实际请求检查，不能声称仅两个域名覆盖全部瓦片资源。

不要把 Web JS Key 直接替换成 Web 服务 Key，也不要通过公开仓库、聊天消息或日志传递安全密钥。云端配置方式由其环境界面决定，配置后单独验证地图。

## 已提交与仅本机内容

| 内容 | 是否随仓库迁移 |
| --- | --- |
| 应用源码、图片、锁文件、文档 | 是 |
| .env.local | 否，云端单独配置 |
| node_modules/、.next/ | 否，在新环境重新安装与构建 |
| .preview/、Cloudflare 可执行文件及日志、临时链接 | 否，属于本机运行状态 |
| GitHub CLI 登录状态和系统代理设置 | 否，平台使用自己的授权与网络配置 |
| 完整聊天记录、用户本机原图目录 | 否；关键决定见 CONVERSATION_HANDOFF.md，已用图片见 public/images/spots/ |

## 当前云端状态

用户最新指令是先创建云端对话，环境以后在那边配置。已发起创建并提交交接提示；没有创建环境、保存云端密钥或部署常驻网站。本文是交接准备，不是云端验收报告。

在云端开始配置时，选择上述仓库，保持仅本人使用，明确工作分支。安装与启动后检查首页、地图、地点详情、活动及通知；分别记录 HTTP 状态、编译结果和真实地图验证结果。不得用页面 HTTP 200 代替地图鉴权与交互验证。

## 本机预览

原工作目录 E:/TianyiWeb。生产预览常使用 127.0.0.1:3100 和 Cloudflare 临时隧道，当前记录地址在被忽略的 .preview/url.txt 中；使用前检查服务和外网连接，不在文档固化易失效地址。重新构建前后留意运行中的生产服务，构建完成后按实际进程重启。

GitHub 只保存源码；Codex Cloud 是开发任务环境。两者都不会自动把本机临时预览变成永久网站。
