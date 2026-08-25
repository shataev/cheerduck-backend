#!/usr/bin/env node
/**
 * Static dev server for the receipt generator.
 *
 * Same job as `serve`, plus one thing `serve` cannot do: when CHEERDUCK_DEV is
 * on it injects `window.CHEERDUCK_DEV = true` into every HTML response, which
 * is what unlocks the "Generate sample PDF (dev)" button in public/index.html.
 * The flag lives in the response, not in the repo, so the deployed files stay
 * production-only.
 *
 *   PORT=4000 CHEERDUCK_DEV=0 node scripts/dev-server.js
 */

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DEV = !['0', 'false', ''].includes(String(process.env.CHEERDUCK_DEV ?? '').toLowerCase());

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const DEV_SNIPPET = '<script>window.CHEERDUCK_DEV = true;</script>';

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const target = path.join(ROOT, path.normalize(decoded));

  // Never serve anything outside the repo.
  if (!target.startsWith(ROOT)) return null;

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    const index = path.join(target, 'index.html');
    return fs.existsSync(index) ? index : null;
  }
  return fs.existsSync(target) ? target : null;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url === '/' ? '/index.html' : req.url);

  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(file).toLowerCase();
  const headers = {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store', // always reload edits during development
  };

  if (ext === '.html') {
    let html = fs.readFileSync(file, 'utf-8');
    if (DEV) {
      html = html.includes('</head>')
        ? html.replace('</head>', `  ${DEV_SNIPPET}\n</head>`)
        : DEV_SNIPPET + html;
    }
    res.writeHead(200, headers);
    res.end(html);
    return;
  }

  res.writeHead(200, headers);
  fs.createReadStream(file).pipe(res);
});

function lanAddress() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal)
    .map((i) => i.address)[0];
}

server.listen(PORT, HOST, () => {
  const lan = lanAddress();
  console.log(`\n  Cheerduck receipt generator — dev mode ${DEV ? 'ON' : 'OFF'}\n`);
  console.log(`  - Local:    http://localhost:${PORT}`);
  if (lan) console.log(`  - Network:  http://${lan}:${PORT}`);
  console.log(DEV
    ? '\n  Sample-PDF button is visible on every device hitting this server.\n'
    : '\n  Sample-PDF button is hidden (CHEERDUCK_DEV is off).\n');
});
