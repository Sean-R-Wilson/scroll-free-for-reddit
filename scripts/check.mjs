// Checks the extension and website for store problems before packaging or publishing.
// Usage: node scripts/check.mjs            (placeholders are reported, not fatal)
//        node scripts/check.mjs --release  (placeholders also fail the check)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const release = process.argv.includes('--release');
const errors = [];
const todo = [];

// Manifest: the fields both stores read.
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'extension/manifest.json'), 'utf8'));
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (manifest.manifest_version !== 3) errors.push('manifest_version must be 3');
if (manifest.name.length > 75) errors.push(`name is ${manifest.name.length} characters; Chrome allows 75`);
if (manifest.description.length > 132) errors.push(`description is ${manifest.description.length} characters; Chrome allows 132`);
if (manifest.version !== pkg.version) errors.push(`manifest version ${manifest.version} differs from package.json ${pkg.version}`);
const iconFiles = [...Object.values(manifest.icons), ...Object.values(manifest.action.default_icon)];
for (const icon of iconFiles) {
  if (!fs.existsSync(path.join(root, 'extension', icon))) errors.push(`missing icon ${icon}; run npm run assets`);
}
for (const file of [manifest.action.default_popup, ...manifest.content_scripts.flatMap((c) => c.js)]) {
  if (!fs.existsSync(path.join(root, 'extension', file))) errors.push(`missing ${file}`);
}
const hosts = manifest.content_scripts.flatMap((c) => c.matches);
if (hosts.some((h) => !/^\*:\/\/(\*\.)?reddit\.com\/\*$/.test(h))) errors.push(`content script reaches beyond reddit.com: ${hosts.join(', ')}`);
if (manifest.permissions?.length || manifest.host_permissions?.length) errors.push('the extension should ask for no permissions beyond its reddit.com content script');

// Content script must at least parse.
try {
  new vm.Script(fs.readFileSync(path.join(root, 'extension/content.js'), 'utf8'), { filename: 'content.js' });
} catch (e) {
  errors.push(`content.js does not parse: ${e.message}`);
}

// Placeholders still waiting for real values.
const scan = (dir) =>
  fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? scan(path.join(dir, d.name)) : /\.(html|js|json|md|css)$/.test(d.name) ? [path.join(dir, d.name)] : [],
  );
for (const file of [...scan('docs'), ...scan('extension'), ...scan('store')]) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const m of new Set(text.match(/[A-Z_]+_TBD/g) || [])) todo.push(`${file}: ${m}`);
}

if (errors.length) console.log('Problems:\n  ' + errors.join('\n  '));
if (todo.length) console.log(`Placeholders to fill before publishing:\n  ${todo.join('\n  ')}`);
if (!errors.length) console.log(`Extension OK: "${manifest.name}" ${manifest.version}, description ${manifest.description.length}/132 characters.`);
process.exit(errors.length || (release && todo.length) ? 1 : 0);
