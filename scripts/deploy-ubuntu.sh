#!/usr/bin/env bash
# Run on a dedicated Ubuntu 24.04 server: sudo bash deploy-ubuntu.sh <commit SHA>
# Passwords and the private AMap code must never be supplied as CLI arguments.
set -Eeuo pipefail
set +x

fail() { printf '\n%s\n' "$*" >&2; exit 1; }
[[ $EUID -eq 0 ]] || fail '请使用 sudo bash 运行此脚本。'
[[ -d /run/systemd/system ]] || fail '需要使用 systemd 的 Ubuntu 服务器。'
# shellcheck source=/dev/null
source /etc/os-release
[[ $ID == ubuntu && $VERSION_ID == 24.04 ]] || fail '此脚本适用于 Ubuntu 24.04。'
source_sha=${1:-}
[[ $source_sha =~ ^[0-9a-f]{40}$ ]] || fail '请传入完整的 40 位 Git 提交 SHA。'
case "$(uname -m)" in
    x86_64) node_arch=x64 ;;
    aarch64) node_arch=arm64 ;;
    *) fail '不支持当前 CPU 架构。' ;;
esac

# Do not replace other applications or an administrator's Nginx sites.
if [[ -d /etc/nginx/sites-enabled ]]; then
    for site in /etc/nginx/sites-enabled/*; do
        [[ -e $site ]] || continue
        [[ $(basename "$site") == default || $(basename "$site") == tianyi ]] ||
            fail "已有其他 Nginx 站点：$site；请先检查，脚本不会覆盖它。"
    done
fi
if ss -ltnH '( sport = :3000 )' | grep -q . && ! systemctl is-active --quiet tianyi; then
    fail '3000 端口已被其他程序使用。'
fi
if ss -ltnH '( sport = :80 )' | grep -q . && ! systemctl is-active --quiet nginx; then
    fail '80 端口已被其他程序使用。'
fi

work_dir=$(mktemp -d /var/tmp/tianyi-deploy.XXXXXX)
chmod 755 "$work_dir"
old_release=$(readlink -f /opt/tianyi/current 2>/dev/null || true)
switched=0
cleanup() {
    local result=$?
    trap - EXIT
    if (( result != 0 )); then
        printf '\n部署未完成，请保留上方错误信息。\n' >&2
        if (( switched )) && [[ -n $old_release && -d $old_release ]]; then
            ln -sfn "$old_release" /opt/tianyi/current
            systemctl restart tianyi || true
            printf '已恢复之前的应用版本。\n' >&2
        fi
    fi
    rm -rf -- "$work_dir"
    exit "$result"
}
trap cleanup EXIT

printf '1/6 安装基础依赖和 Node.js 24 LTS…\n'
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl xz-utils nginx python3
download() { curl --fail --location --retry 3 --connect-timeout 15 --max-time 300 --proto '=https' --proto-redir '=https' "$1" -o "$2"; }
download https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt "$work_dir/SHASUMS256.txt"
node_archive=$(awk -v suffix="-linux-$node_arch.tar.xz" '$2 ~ suffix"$" {print $2}' "$work_dir/SHASUMS256.txt")
[[ $node_archive =~ ^node-v24\.[0-9]+\.[0-9]+-linux-(x64|arm64)\.tar\.xz$ ]] || fail 'Node.js 下载清单无效。'
download "https://nodejs.org/dist/latest-v24.x/$node_archive" "$work_dir/$node_archive"
awk -v file="$node_archive" '$2 == file' "$work_dir/SHASUMS256.txt" > "$work_dir/node.sha256"
(cd "$work_dir" && sha256sum --check node.sha256)
install -d -m 755 /opt/tianyi /opt/tianyi/releases /opt/tianyi/runtimes
tar -xJf "$work_dir/$node_archive" -C /opt/tianyi/runtimes
ln -sfn "/opt/tianyi/runtimes/${node_archive%.tar.xz}" /opt/tianyi/node
if ! id tianyi >/dev/null 2>&1; then
    useradd --system --create-home --home-dir /var/lib/tianyi --shell /usr/sbin/nologin tianyi
fi
install -d -o tianyi -g tianyi -m 750 /opt/tianyi/cache /var/cache/tianyi/npm

printf '2/6 下载指定版本源码…\n'
download "https://codeload.github.com/ruixuecr/TianyiserverWeb/tar.gz/$source_sha" "$work_dir/source.tar.gz"
mkdir "$work_dir/source"
tar -xzf "$work_dir/source.tar.gz" -C "$work_dir/source" --strip-components=1
source_dir="$work_dir/source"
public_key=$(sed -n 's/^NEXT_PUBLIC_AMAP_KEY=//p' "$source_dir/.env.example" | tr -d '\r')
[[ $public_key =~ ^[[:xdigit:]]{32}$ ]] || fail '源码模板中的高德浏览器 Key 缺失。'

printf '3/6 配置高德安全密钥…\n'
private_code=''
if [[ -f /etc/tianyi.env ]]; then
    private_code=$(sed -n 's/^AMAP_SECURITY_CODE=//p' /etc/tianyi.env)
fi
if [[ ! $private_code =~ ^[[:xdigit:]]{32}$ ]]; then
    private_code=''
    if [[ -r /dev/tty ]]; then
        printf '请输入高德安全密钥（输入不显示；直接回车则先部署页面）：' >/dev/tty
        IFS= read -r -s private_code </dev/tty || true
        printf '\n' >/dev/tty
    fi
    [[ -z $private_code || $private_code =~ ^[[:xdigit:]]{32}$ ]] || fail '安全密钥格式应为 32 位十六进制字符。'
fi
env_file="$work_dir/tianyi.env"
(umask 077; printf 'NEXT_PUBLIC_AMAP_KEY=%s\nAMAP_SECURITY_CODE=%s\n' "$public_key" "$private_code" > "$env_file")
map_configured=0
[[ -z $private_code ]] || map_configured=1
unset private_code

printf '4/6 安装锁定依赖并构建（可能需要数分钟）…\n'
chown -R tianyi:tianyi "$source_dir"
build_path="/opt/tianyi/node/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
(
    cd "$source_dir"
    runuser -u tianyi -- env PATH="$build_path" npm_config_cache=/var/cache/tianyi/npm npm ci --include=dev --no-audit --no-fund
    runuser -u tianyi -- env PATH="$build_path" TIANYI_STANDALONE=1 NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_AMAP_KEY="$public_key" NODE_OPTIONS=--max-old-space-size=4096 npm run build
)
release_dir="/opt/tianyi/releases/$(date -u +%Y%m%dT%H%M%SZ)-${source_sha:0:12}"
mkdir -m 755 "$release_dir"
cp -a "$source_dir/.next/standalone/." "$release_dir/"
cp -a "$source_dir/public" "$release_dir/public"
cp -a "$source_dir/.next/static" "$release_dir/.next/static"
[[ -f $release_dir/server.js ]] || fail '未生成独立运行包。'
printf '%s\n' "$source_sha" > "$release_dir/SOURCE_COMMIT"
rm -rf "$release_dir/.next/cache"
ln -s /opt/tianyi/cache "$release_dir/.next/cache"
chown -R root:root "$release_dir"
chmod -R a+rX "$release_dir"

printf '5/6 配置开机自启和 Nginx…\n'
install -m 600 "$env_file" /etc/tianyi.env
install -m 644 "$source_dir/deploy/tianyi.service" /etc/systemd/system/tianyi.service
install -m 644 "$source_dir/deploy/tianyi.nginx.conf" /etc/nginx/sites-available/tianyi
install -d -o www-data -g www-data -m 750 /var/cache/nginx/tianyi-images
if [[ -L /etc/nginx/sites-enabled/default && $(readlink -f /etc/nginx/sites-enabled/default) == /etc/nginx/sites-available/default ]]; then
    rm /etc/nginx/sites-enabled/default
elif [[ -e /etc/nginx/sites-enabled/default ]]; then
    fail '默认 Nginx 站点不是标准符号链接，请先检查，脚本未删除。'
fi
ln -sfn /etc/nginx/sites-available/tianyi /etc/nginx/sites-enabled/tianyi
nginx -t
ln -sfn "$release_dir" /opt/tianyi/current
switched=1
systemctl daemon-reload
systemctl enable tianyi nginx
systemctl restart tianyi
ready=0
for _attempt in {1..30}; do
    if curl -fsS --max-time 2 http://127.0.0.1:3000/notices/fraud-alert -o /dev/null; then ready=1; break; fi
    sleep 1
done
(( ready )) || fail '应用启动检查失败；执行 sudo journalctl -u tianyi -n 50 查看原因。'
systemctl restart nginx
if command -v ufw >/dev/null && ufw status | grep -q 'Status: active'; then
    ufw allow 80/tcp
fi

printf '6/6 验证服务器内的网站响应…\n'
for page in / /map /events /recommendations /notices/fraud-alert /spots/aoti; do
    curl -fsS --max-time 10 "http://127.0.0.1$page" -o /dev/null
done
curl -fsS --max-time 10 http://127.0.0.1/api/map-config -o "$work_dir/map-config.json"
python3 - "$work_dir/map-config.json" <<'PY'
import json, re, sys
data = json.load(open(sys.argv[1]))
assert set(data) == {'key'} and re.fullmatch(r'[a-fA-F0-9]{32}', data['key'])
print('页面、公开地图配置接口、开机自启配置检查通过。')
PY
printf '部署源码版本：%s\n' "$source_sha"
printf '请在腾讯云实例防火墙放行 TCP 80，然后从外部浏览器访问公网 IP。\n'
if (( map_configured )); then
    printf '高德安全密钥已保存于服务器；还需在浏览器验证真实地图与高德域名白名单。\n'
else
    printf '高德安全密钥尚未填写，地图暂不可用；页面已部署。用 sudo nano /etc/tianyi.env 补填后执行 sudo systemctl restart tianyi。\n'
fi
