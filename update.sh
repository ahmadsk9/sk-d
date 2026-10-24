#!/usr/bin/env bash
# يسحب آخر نسخة من GitHub ويعيد تشغيل الموقع إذا في تغيير
cd /opt/sk || exit 1
git fetch -q origin || exit 0
[ "$(git rev-parse HEAD)" = "$(git rev-parse '@{u}')" ] && exit 0
git reset -q --hard '@{u}'
mkdir -p node_modules/@netlify/blobs
cp blobs-shim.mjs node_modules/@netlify/blobs/index.js
echo '{"name":"@netlify/blobs","type":"module","main":"index.js","version":"0.0.0"}' > node_modules/@netlify/blobs/package.json
systemctl restart sk
echo "$(date) updated to $(git rev-parse --short HEAD)"
