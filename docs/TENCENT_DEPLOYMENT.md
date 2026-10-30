# 腾讯云 Ubuntu 部署

发布约定（2026-10-30 最新确认）：后续网站修改先更新 Sites 预览与 GitHub，腾讯云正式站保持当前已部署版本，等用户明确要求统一打包“热更新”时再累计发布。普通修改、预览更新或 GitHub 推送不触发服务器部署；下方更新命令仅在用户要求发布该批改动时使用。现有流程会构建并重启服务，可能短暂中断，不代表零停机热替换。

状态：用户已在腾讯云终端完成安装并补配安全密钥，服务返回 active；**公网页面、图片缓存及高德 SDK 行政区/地点查询均已验证成功**。当前地址为 http://81.70.239.136/ ，暂未提供域名。当前测试浏览器不支持高德 WebGL，完整 3D 画面需在用户设备确认。助手仍无法直接 SSH，服务器操作结果来自用户终端输出，公网访问和接口结果已独立核验。

目标为用户新购的 Ubuntu Server 24.04、2 核 8GB、80GB SSD 轻量服务器。截图已确认入站 TCP 22 和 80 允许。当前工作环境 TCP 允许列表为空，配置中的 TCP 代理连接被拒绝，因此无法发起 SSH 或验证登录密码。腾讯云入站防火墙与本工作环境出站网络属于不同环节；未提供界面入口时，不反复让用户寻找不存在的设置，也不尝试绕过出站策略。

待发布更新：源码已恢复首页、打卡推荐和地点详情的 2D/3D 切换，并完成构建、类型及模拟 SDK 的桌面/手机交互检查。该更新需要用户在腾讯云终端再次运行部署脚本；当前已确认的服务器源码仍为下文的 65457b6，不能把推送 GitHub 等同于公网已更新。真实两种模式下的武汉遮罩、样式和完整标签仍需受支持的浏览器验收。

用户随后要求先更新站点预览；该切换功能已于 2026-10-30 20:40:13 UTC 发布到原 Sites 私有预览。此次只更新预览，不代表腾讯云服务器版本变化，发布信息见 SITES_PREVIEW.md。

累计待发布内容另含黄鹤楼打卡点：用户确认 2020-03，提供芭莎取景介绍与原图，详情路径 /spots/huanghe-tower；地点总数增至 10。与 2D/3D 切换一并等待用户明确要求统一发布，GitHub 与预览的更新不能视为腾讯云已上线。

随后新增武汉大学樱花路（/spots/wuhan-university-sakura），同组 2020-03 芭莎原文和图片，地点共 11 个、2020 年 4 个。该项同样累计待统一发布。通过现有腾讯云地图代理进行的只读 POI 查询没有修改服务器或其应用版本。

累计待发布另有武汉汉口里竹林（/spots/hankouli-bamboo），同组 2020-03 芭莎原文与原图，用户明确选择先导航到汉口里区域；竹林取景位置未核实。最新源码为 12 个地点、2020 年 5 个，腾讯云仍是原版本。

随后加入平湖珞樱观湖平台（/spots/pinghu-luoying），日期由用户确认 2026-10，单段原文与竖版照片完整保留。最新源码共 13 个地点、2026 年 4 个，同样只更新 GitHub 与 Sites，等待统一发布。

东湖另有待发布更新：时间改为 2020年3月 & 7月，详情在原城市巡礼图之后追加芭莎竹筏照片，仍为一个地点。总数仍为 13，2020 年仍为 5 个；与此前累计改动一起等待用户统一发布。

中百罗森另有待发布更新：用户确认洪山区梳子桥路2附43号广厦华庭1楼104商铺，地址与区域已补全，地图匹配和高德选点导航带完整门牌。只读高德查询核对名称及门牌一致，没有更新腾讯云应用；随以上改动统一发布。

2026-10-30 用户随后要求更新代码，已提供固定版本 918dc98e7005dda94985eb29e09ba62b08f528ef 的命令；尚未收到执行结果，以上待发布状态未据此改为完成。之后新增的洛天依快闪店（/spots/tianyi-popup，2026-10，江夏区流芳路84号、完整活动介绍和海报）是新一批待发布改动，只更新 GitHub 与 Sites。

## 安装入口

在腾讯云实例页面选择“登录”进入终端，以 ubuntu 用户运行提供的固定版本命令。先用 curl 将 scripts/deploy-ubuntu.sh 下载到 /tmp，再以 sudo bash 执行，并传入相同的完整 Git 提交 SHA。脚本从该 SHA 下载源码，不会部署默认 main 的旧 demo。命令中的服务器登录密码不需要填写，也不允许以参数传入。

已验证的首个部署版本为 65457b6022e107b7641b887ae4bba0b9a4c65264，用户终端返回的已部署版本与此一致：

```bash
TIANYI_COMMIT=65457b6022e107b7641b887ae4bba0b9a4c65264
curl -fL --retry 3 "https://raw.githubusercontent.com/ruixuecr/TianyiserverWeb/$TIANYI_COMMIT/scripts/deploy-ubuntu.sh" -o /tmp/tianyi-deploy.sh && sudo bash /tmp/tianyi-deploy.sh "$TIANYI_COMMIT"
```

安装脚本依次完成：

1. 检查 Ubuntu 24.04、systemd、已有端口与其他 Nginx 站点，遇冲突停止，不覆盖其他站点。
2. 安装 Nginx、curl、Python、xz；下载官方 Node.js 24 LTS，核对官方 SHA-256 清单，安装到 /opt/tianyi/node。
3. 从 GitHub codeload 下载指定提交，读取已授权公开的浏览器 Key；隐藏提示输入 AMAP_SECURITY_CODE，回车留空则地图待配。
4. 以独立 tianyi 用户执行 npm ci 和独立运行包构建，包含原图与静态资源。安全密钥不传入构建。
5. 写入 root 专用 /etc/tianyi.env、systemd 服务与 Nginx 配置，启动并设置开机自启。只有标准默认站点符号链接会被移除，配置文件保留。
6. 检查服务器本机多个页面与公开地图配置接口。只有外部浏览器复核通过后，才能确认公网访问成功。

首次构建需要访问 Ubuntu 软件源、nodejs.org、GitHub codeload、npm 源。任一下载失败会停止并显示错误，不关闭 TLS 验证、不自动改用来源不明的软件。若网络失败，保留错误文字以便处理。此脚本针对独立站点服务器；已有自定义 Nginx/其他应用时应先人工核对。

## 运行目录与维护

| 位置 | 用途 |
| --- | --- |
| /opt/tianyi/releases/时间-提交/ | 每次构建的独立运行包，SOURCE_COMMIT 记录源码提交 |
| /opt/tianyi/current | 当前运行版本的符号链接 |
| /opt/tianyi/node | Node.js 24 运行时 |
| /opt/tianyi/cache | Next.js 图片等缓存，可由 tianyi 写入 |
| /var/cache/nginx/tianyi-images | Nginx 图片响应缓存，上限 1GB |
| /etc/tianyi.env | root 0600 环境配置，不提交 Git |
| /etc/systemd/system/tianyi.service | 非 root 运行、失败重启、开机自启 |
| /etc/nginx/sites-available/tianyi | HTTP 反向代理与静态资源配置 |

```bash
sudo systemctl status tianyi nginx --no-pager
sudo journalctl -u tianyi -n 50 --no-pager
sudo nginx -t
```

补填高德安全密钥：运行 sudo nano /etc/tianyi.env，修改 AMAP_SECURITY_CODE，然后执行 sudo systemctl restart tianyi。不要把该文件内容粘贴到 GitHub 或日志。公开浏览器 Key 已在构建时注入，若更换此 Key，应更新模板并重新构建部署。

重复运行部署脚本会保留已有安全密钥，创建新的运行目录。若版本切换后的启动/本机检查失败且存在旧版本，脚本恢复旧应用符号链接并重启；系统软件安装、配置文件和环境文件不属于完整系统回滚。旧运行目录和 Node 版本暂不自动删除。

更新现有服务器到当前工作分支最新版（GitHub 推送不会自动发布，需在腾讯云终端执行；最终切换会重启服务，可能短暂中断）：

```bash
bash <<'SH'
set -euo pipefail
TIANYI_COMMIT=$(curl -fsSL --retry 3 'https://api.github.com/repos/ruixuecr/TianyiserverWeb/commits/codex%2Fencore-theme-elements' | python3 -c 'import json,sys; print(json.load(sys.stdin)["sha"])')
curl -fL --retry 3 "https://raw.githubusercontent.com/ruixuecr/TianyiserverWeb/$TIANYI_COMMIT/scripts/deploy-ubuntu.sh" -o /tmp/tianyi-deploy.sh
sudo bash /tmp/tianyi-deploy.sh "$TIANYI_COMMIT"
SH
```

## 网络与验收边界

- 应用只监听 127.0.0.1:3000，外网开放 Nginx 的 TCP 80，无需开放 3000。服务器 UFW 若已启用，脚本追加 80 规则；不改变 SSH 规则。
- 暂未配置域名或 HTTPS，先验证 HTTP 公网 IP。实际地域尚未核验；如为中国内地服务器，对外网站仍需符合腾讯云备案接入要求，IP 访问不能替代备案。
- 高德服务端安全密钥此前在 Sites 以 secret 存储，读取接口不返回明文，迁移需重新填写。需检查高德 Key 对新访问地址的白名单设置，并用支持 WebGL 的真实浏览器核验地图。
- Nginx 直接提供哈希静态文件，图片优化缓存包含 Accept 维度；HTML/RSC 不额外缓存，地图接口保留 no-store。200Mbps 为峰值，当前无这台服务器的 1000 人访问压测结果。
- 服务器的账户、初始登录密码与订单不保存到项目代码或文档。原 Sites 私有预览及其环境变量未改变。

## 已完成的本地检查

- TIANYI_STANDALONE=1 的生产构建与 npm run typecheck 通过，独立运行目录约 74MB。
- bash -n 与 ShellCheck 0.10.0 通过；systemd-analyze verify 通过（校验时仅将不存在于本地的服务器 Node 路径替换为本地 Node）。
- Nginx 1.28.0 配置检查通过，并实际反向代理独立运行包；本地测试替换了监听端口和文件目录。
- 11 个页面 200，已删除/未知的 5 个入口 404；12 个哈希静态资源返回 immutable。
- 公开配置只返回浏览器 Key；缺少安全密钥时代理返回预期 503。
- 原图返回 JPEG 和缓存头，优化图返回 WebP；连续请求缓存状态从 MISS 变为 HIT。

上述检查不包含在用户服务器安装系统服务、真实高德鉴权、域名/HTTPS、外部网络可达性或服务器承载能力。

## 用户执行后的公网核验

用户已返回脚本完成输出，部署版本为 65457b6022e107b7641b887ae4bba0b9a4c65264，并明确提示高德安全密钥尚未填写。随后从当前工作环境通过正常 HTTP 出站访问公网 IP，核验首页、/map、/notices/fraud-alert、/spots/aoti、/recommendations 均返回 200，且匹配当前正式文案；/api/map-config 只返回浏览器 Key 并带 no-store。图片优化返回 WebP，重复请求 X-Image-Cache=HIT。

首次检查时 /_AMapService/v4/map/styles 返回 503 和 Map security code not configured。用户随后执行终端配置命令，更新 /etc/tianyi.env 的 AMAP_SECURITY_CODE、保留浏览器 Key、保持 0600 权限并重启 tianyi，返回 active 和“密钥已保存，服务已重启”。密钥值不写入仓库。

补配后，在 Chromium 打开公网 /map 并通过真实高德 JS SDK 发起查询：服务端代理的 /v3/log/init、/v3/config/district、/v3/place/text 均返回 200；DistrictSearch 查询 420100 返回 complete / OK、武汉行政区代码 420100 和 4 条边界环；PlaceSearch 搜索古田桥返回 complete / OK 和 5 条候选。页面无运行错误。测试浏览器的 AMap.Browser.isWebGL=false，页面正确显示兼容提示，因此没有验证完整 3D 渲染、全部地点标签或自定义样式视觉效果；未把查询候选当成已确认导航坐标。域名、HTTPS、重启服务器后的自启效果及承载能力仍未验证。
