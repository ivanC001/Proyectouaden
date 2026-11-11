import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const config = JSON.parse(fs.readFileSync('deploy/allowlist.json', 'utf8'));
if (config.mode !== 'dry-run-only') throw new Error('Solo se admite simulación.');
const blocked = new Set(['wp-admin', 'wp-content', 'wp-includes', 'campuss', 'preuaden', 'registro', 'uadenw', 'old']);
const files = execFileSync('git', ['ls-files', '-z'], { maxBuffer: 20_000_000 }).toString().split('\0').filter(Boolean);
const plan = [];
for (const file of files) {
  const parts = file.split('/');
  if (parts.some(p => p.startsWith('.') || blocked.has(p) || p === '..')) continue;
  if (path.posix.extname(file) !== '.html') continue;
  if (!(config.rootFiles.includes(file) || (parts.length > 1 && config.directories.includes(parts[0])))) continue;
  if (fs.lstatSync(file).isSymbolicLink()) throw new Error(`Enlace simbólico rechazado: ${file}`);
  plan.push({ local: file, remoteRelative: file });
}
if (!plan.length) throw new Error('No hay HTML autorizado.');
fs.mkdirSync('deploy-output', { recursive: true });
fs.writeFileSync('deploy-output/plan.json', JSON.stringify({ simulation: true, remoteRoot: config.remoteRoot, files: plan }, null, 2));
console.log(`SIMULACIÓN: ${plan.length} archivos HTML. No se abre ninguna conexión remota.`);
for (const file of plan) console.log(file.remoteRelative);
if (!config.remoteRoot) console.log('Pendiente: ruta absoluta de public_html y comprobación de propiedad de cada destino.');
