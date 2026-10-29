# 本地与云端开发交接

更新日期：2026-10-29。

## 仓库与分支

仓库：https://github.com/ruixuecr/TianyiserverWeb （私有）。地图基线分支为 mapapi，当前云端功能工作分支为 codex/encore-theme-elements；默认 main 保留原始 demo。继续当前主题、活动与推荐功能时检出该工作分支，不更改远端默认分支或覆盖 main。

最初的两个实验分支 codex/crisp-map-labels 与 codex/svg-tilted-labels 已保留。后续以 Git 的实际提交记录为准。

本次主题工作分支为 codex/encore-theme-elements，基于 mapapi 的 0d4bc49。已按用户提供的素材添加时光主题与 Radix UI 组件；用户进一步确认天依的设定是「时间魔女」，角色与时间意象都是主体，后续设计沿用这一统一主题。未移动 main 或 mapapi 的分支指针。主题需求和实现说明分别见 PROJECT_REQUIREMENTS.md 与 TECHNICAL_ARCHITECTURE.md。

用户要求代码、项目文档和项目记忆持续同步到 GitHub。完成修改后提交并推送当前工作分支，核对本地 HEAD 与远端提交一致，不只停留在本地工作区。关键决策记录在 CONVERSATION_HANDOFF.md 并同步相关需求/架构文档；密钥、依赖、构建缓存和临时预览运行文件继续按忽略规则排除。

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

用户已在云端对话中明确要求“创建云端环境”。2026-10-28 UTC（北京时间 2026-10-29）已完成当前会话云端工作区初始化：

- 工作目录：/workspace/TianyiserverWeb；检出 mapapi，基线为 0d4bc49d0acbcf10fb1b3b85d308d730d3d9f3a4（在 f54774d 之上补充交接文档）。完整克隆包含 4 个远端分支及提交历史；远端默认分支仍为 main。
- 运行时：Node.js 24.19.0、npm 11.9.0。npm ci 成功，使用锁文件中的 Next.js 16.3.8、React 19.3.0；没有升级依赖。
- npm run build 与 npm run typecheck 均通过。
- npm run dev 已启动并监听 0.0.0.0:3000；云端内部地址为 http://127.0.0.1:3000。此地址不是用户本机地址或公开预览链接，进程状态以当前会话为准；停止后可在工作目录重新运行 npm run dev。
- HTTP 检查：首页、地图、天宝/奥体/武汉博物馆详情、活动列表及 weekend 详情、通知列表及 welcome 详情均返回 200；武汉博物馆详情响应包含新名称和青年路373号。
- 高德变量 NEXT_PUBLIC_AMAP_KEY、AMAP_SECURITY_CODE 均未配置。/_AMapService/v4/map/styles 返回预期的 503，说明缺少安全密钥时的代理路径已生效；未验证真实高德鉴权、底图、标签或入口坐标。

本次初始化的是当前会话开发工作区，未保存可复用的平台环境配置，也未部署常驻网站。初始化阶段未修改应用源码与锁文件；后续主题变更位于独立工作分支，临时预览状态见下文。后续真实地图测试需通过云端安全配置入口提供凭据，并在实际浏览器检查高德网络与交互。不得用页面 HTTP 200 代替地图鉴权与交互验证。

## 当前 Sites 预览

2026-10-29 用户指定使用 Sites 重新部署，随后提供高德凭据并要求配置。当前为带服务端代理的 Worker 预览：https://tianyi-encore-preview-ruixue.ratsnaiwazcr.chatgpt.site ，原生部署状态 succeeded，仅所有者可访问。项目 ID 已保存在 .openai/hosting.json；复用既有站点，勿重新创建。导出脚本、版本/部署 ID 和更新步骤见 SITES_PREVIEW.md。

两项高德凭据已存入 Sites 的加密环境变量，revision 1 随部署生效。Worker 提供公开 Key 配置端点和仅服务端使用安全密钥的高德代理，完整应用源码与代理共用实现仍在 GitHub。线上 SDK、行政区边界与地点搜索已验证；云端 Chromium 的 SDK WebGL 判定为 false，无法验证真实 3D，现网会显示浏览器兼容提示。原俯视相机、样式、武汉遮罩及标签样式保留，所有 POI 坐标和标签仍未验证齐全。

旧 Next.js 服务与隧道均已停止，不再返回旧 Tunnelmole 地址。Sites 页面和代理不依赖云端开发进程；本地 QA 服务器在完成验证后停止。此次没有把用户凭据写入云端 .env.local 或仓库，独立的本地开发环境仍需另行安全注入。build/typecheck、代理专项检查、页面与交互检查均有记录，详见 SITES_PREVIEW.md。

## 云端临时预览历史

用户确认类似 trycloudflare.com 的临时链接即可，无需为本次预览连接 Vercel 或部署永久托管。

- 曾在云端启动生产预览：npm run start -- --port 3100；当时已更新为 codex/encore-theme-elements 的生产构建。以下为历史记录，进程现已停止，当前入口以 Sites 为准。
- Cloudflare Quick Tunnel 创建失败：客户端直连被拒绝；通过当前 HTTP 代理访问实际创建接口 https://api.trycloudflare.com/tunnel 返回 403，响应为 Your request was blocked。未生成可用 Cloudflare 地址。
- 已改用 Tunnelmole 2.4.0，WebSocket 连接显式使用继承的 HTTP/HTTPS 代理并保持 TLS 验证。辅助程序与依赖均位于 Git 忽略的 .preview/；启动命令为 node .preview/start-tunnel.mjs，当前临时链接记录在 .preview/url.txt，不在文档固化地址。
- 外网已核对首页、/map、武汉博物馆详情、活动及通知页面的 HTTP 200 和对应内容；地点图片、CSS 与 JS 资源均返回 200。高德样式代理返回预期的缺少安全密钥 503，真实地图仍未验证。
- 预览链接公开可访问，依赖云端环境、3100 端口服务和隧道进程持续运行；停止或重建隧道后地址可能失效或改变。恢复预览前先核对现有进程，避免重复启动；源码变更后需重新构建并重启生产服务。
- 新增组件后已通过 npm ci 安装锁定依赖；Next.js、React 等原有包版本保持不变。主题分支通过 build/typecheck；生产服务上完成桌面 1440px、手机 390px 浏览器交互与图片比例检查。内部检查脚本和截图保留在被忽略的 .preview/。开发服务曾因安装期间的缓存状态出现旧 HTML/新客户端不一致，已停止旧开发进程，并在全新生产构建中确认无水合错误；需要开发服务时重新运行 npm run dev。
- 全站配色统一后再次通过 build/typecheck；10 个首页、地图、地点、活动和通知代表页面在 1440px / 390px 视口共完成 20 次页面检查，确认共享底色、文字、按钮悬停、选中卡片、SVG 插画配色，无横向溢出或浏览器运行错误。地点筛选、图片原比例和时钟设置交互检查通过；高德实图仍不在本次验证范围。
- 图片优化通过 build/typecheck；390px / 1440px、2 倍像素比浏览器验证 responsive WebP、首页主图优先加载及图片尺寸占位，6 张地点详情图保留比例，模拟请求失败时卡片插画和详情占位正常。18 个地点图片尺寸变体均返回 WebP；外网首页及代表性图片请求通过，图片返回 4 小时缓存。390px 首页图片合计从 265,828 字节降至 31,838 字节；天宝地图图从 697,760 降至 82,342 字节；博物馆详情图从 937,125 降至 50,220 字节。测量报告和截图在 .preview/；数据表示传输体积，不作为用户实际网络加载时间承诺。
- 活动与推荐更新通过 npm ci、build/typecheck；新增 Radix Dialog 1.3.1，已有依赖版本未改变。Chromium 在 1440/1024/820/390/320px 下检查 6 个页面，共 30 组页面/视口组合；活动入口数量、10 个花篮展示位、单条示例、居中弹窗、内部滚动、背景锁滚、Tab 焦点圈定、三种关闭方式、焦点恢复、推荐筛选/搜索/空结果恢复和旧活动跳转均通过。额外验证图片错误重试、地图选择与原图比例、动效偏好保存。截图和脚本在 .preview/；这些检查不包含缺少凭据的真实高德地图。
- 外网 /events、三个新活动详情、/recommendations 和首页已核对 HTTP 200 及对应内容。真实活动图片、二维码、地址、时间与发放内容仍待提供，填写说明见 ACTIVITY_CONTENT.md。

## 本机预览

原工作目录 E:/TianyiWeb。生产预览常使用 127.0.0.1:3100 和 Cloudflare 临时隧道，当前记录地址在被忽略的 .preview/url.txt 中；使用前检查服务和外网连接，不在文档固化易失效地址。重新构建前后留意运行中的生产服务，构建完成后按实际进程重启。

GitHub 只保存源码；Codex Cloud 是开发任务环境。两者都不会自动把本机临时预览变成永久网站。
