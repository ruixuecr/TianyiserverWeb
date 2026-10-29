# TianyiserverWeb · 江城 Encore

个人武汉演唱会与城市打卡指南。包含简约首页、真实武汉地图、地点攻略、活动、通知和美食商场推荐。当前收录 7 个地图地点，使用静态数据，无数据库或账号系统。

## 开发版本

- mapapi：当前开发版本，已接入高德真实地图。
- codex/encore-theme-elements：当前云端工作分支；包含天依「时间魔女」蓝白主题、响应式图片、三类活动与美食商场推荐。角色与时间意象同为主题核心。
- main：用户指定保留的原始 demo，不要用最新版覆盖。
- codex/crisp-map-labels、codex/svg-tilted-labels：保留的实验分支。

仓库：[ruixuecr/TianyiserverWeb](https://github.com/ruixuecr/TianyiserverWeb)，私有。

## 文档入口

首次接手请阅读：

1. [项目介绍与需求](docs/PROJECT_REQUIREMENTS.md)
2. [技术架构与实现细节](docs/TECHNICAL_ARCHITECTURE.md)
3. [对话决策与已知问题](docs/CONVERSATION_HANDOFF.md)
4. [本地与云端开发交接](docs/DEVELOPMENT_HANDOFF.md)
5. [活动资料填写与验收入口](docs/ACTIVITY_CONTENT.md)
6. [Sites 预览构建与发布](docs/SITES_PREVIEW.md)

文档以 2026-10-29 的 mapapi 源码及已确认用户需求为基准。对话交接是关键事实摘要，不是完整聊天记录，也不会自动同步后续对话。

## 启动与检查

安装：npm ci。开发：npm run dev，访问 http://localhost:3000。

检查：npm run build，然后 npm run typecheck。使用现有锁文件安装，不因迁移顺便升级依赖。

技术栈为 Next.js App Router、React、TypeScript、Tailwind CSS 4、lucide-react，版本以 package.json 与 package-lock.json 为准。修改框架代码前先阅读 AGENTS.md 和安装包内的 Next.js 指南。

## 高德配置

复制 .env.example 为 .env.local，填写 NEXT_PUBLIC_AMAP_KEY 和 AMAP_SECURITY_CODE。配置文件不入库，安全密钥仅服务端使用。云端需要单独配置，不能依赖本地文件。

当前地图固定为 3D 俯瞰，已通过行政区遮罩限制武汉范围。无 Key 时显示待配置提示，加载失败时显示错误状态，不会回退为旧 SVG 地图。7 个地点条目不代表每次一定显示 7 个标签：当前仍依赖浏览器端 POI 精确搜索，失败或歧义结果会暂不标注。

活动入口为服务站、应援花篮、海底捞。花篮保留 10 个展示位，只有首条为明确标注的示例；真实活动地址、时间、物资、花篮图片及群二维码尚待提供。预览正在迁移至用户指定的 Sites，发布记录与静态托管边界见 [Sites 预览说明](docs/SITES_PREVIEW.md)。
