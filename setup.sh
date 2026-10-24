#!/usr/bin/env bash
# تجهيز سيرفر Ubuntu لموقع SK. الاستخدام:
#   bash setup.sh skdesign.life مفتاح_الأدمن [موضوع_ntfy]
set -e
DOMAIN="${1:?اكتب الدومين}"; KEY="${2:?اكتب مفتاح الأدمن (8 أحرف على الأقل)}"; NTFY="${3:-}"
REPO="git@github.com:ahmadsk9/wedding-invitations-platform.git"
[ ${#KEY} -ge 8 ] || { echo "المفتاح أقل من 8 أحرف"; exit 1; }

apt-get update -y
apt-get install -y git curl gnupg ufw debian-keyring debian-archive-keyring apt-transport-https
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
apt-get update -y && apt-get install -y caddy

# مفتاح قراءة فقط للمستودع الخاص
mkdir -p /root/.ssh && chmod 700 /root/.ssh
[ -f /root/.ssh/sk_deploy ] || ssh-keygen -t ed25519 -N "" -f /root/.ssh/sk_deploy -C sk-vps
echo; echo "===== انسخ المفتاح التالي ====="; cat /root/.ssh/sk_deploy.pub; echo "==============================="
echo "GitHub > المستودع > Settings > Deploy keys > Add deploy key (لا تفعّل Write access)، ثم ارجع هنا واضغط Enter"
read -r _
ssh-keyscan github.com >> /root/.ssh/known_hosts 2>/dev/null
if [ ! -d /opt/sk/.git ]; then
  GIT_SSH_COMMAND="ssh -i /root/.ssh/sk_deploy -o IdentitiesOnly=yes" git clone "$REPO" /opt/sk
fi
git -C /opt/sk config core.sshCommand "ssh -i /root/.ssh/sk_deploy -o IdentitiesOnly=yes"

id sk >/dev/null 2>&1 || useradd -r -s /usr/sbin/nologin sk
mkdir -p /var/lib/sk-data /var/backups && chown -R sk:sk /var/lib/sk-data
umask 077
printf 'ADMIN_KEY=%s\nDATA_DIR=/var/lib/sk-data\nNTFY_TOPIC=%s\nPORT=3000\n' "$KEY" "$NTFY" > /etc/sk.env
umask 022

mkdir -p /opt/sk/node_modules/@netlify/blobs
cp /opt/sk/blobs-shim.mjs /opt/sk/node_modules/@netlify/blobs/index.js
echo '{"name":"@netlify/blobs","type":"module","main":"index.js","version":"0.0.0"}' > /opt/sk/node_modules/@netlify/blobs/package.json
chmod +x /opt/sk/update.sh

cat > /etc/systemd/system/sk.service << UNIT
[Unit]
Description=SK Design site
After=network.target
[Service]
User=sk
WorkingDirectory=/opt/sk
EnvironmentFile=/etc/sk.env
ExecStart=/usr/bin/node /opt/sk/server.mjs
Restart=always
[Install]
WantedBy=multi-user.target
UNIT
cat > /etc/caddy/Caddyfile << CADDY
$DOMAIN {
	encode gzip
	reverse_proxy 127.0.0.1:3000
}
www.$DOMAIN {
	redir https://$DOMAIN{uri} permanent
}
CADDY
echo "*/2 * * * * root /opt/sk/update.sh >> /var/log/sk-update.log 2>&1" > /etc/cron.d/sk-update
echo "0 3 * * * root tar czf /var/backups/sk-data-\$(date +\\%a).tgz -C /var/lib sk-data" > /etc/cron.d/sk-backup

ufw allow OpenSSH; ufw allow 80/tcp; ufw allow 443/tcp; ufw --force enable
systemctl daemon-reload; systemctl enable --now sk; systemctl restart caddy
echo; echo "تم. افتح https://$DOMAIN/sk-admin.html (تأكد أن DNS يشير لهذا السيرفر)"
