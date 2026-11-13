// Builds the zip file to upload to the Chrome Web Store: dist/scroll-free-for-reddit-<version>.zip
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
execFileSync('node', [path.join(root, 'scripts/check.mjs')], { stdio: 'inherit' });

const { version } = JSON.parse(fs.readFileSync(path.join(root, 'extension/manifest.json'), 'utf8'));
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
const zip = path.join(dist, `scroll-free-for-reddit-${version}.zip`);
fs.rmSync(zip, { force: true });
// -X leaves out macOS extra file attributes; .DS_Store files are excluded.
execFileSync('zip', ['-r', '-X', zip, '.', '-x', '*.DS_Store'], { cwd: path.join(root, 'extension'), stdio: 'ignore' });
console.log(`Chrome Web Store upload file: ${zip}`);
