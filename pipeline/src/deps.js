// Resuelve playwright-core sin `npm install`: primero el node_modules del pipeline y, si no está,
// las instalaciones globales conocidas (la máquina de la nube trae playwright y Chromium preinstalados).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const req = createRequire(import.meta.url);
function globales() {
  const rutas = [];
  try { rutas.push(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()); } catch {}
  rutas.push('/opt/node-tools/node_modules', '/opt/npm-tools/node_modules');
  return rutas.filter(r => r && fs.existsSync(r));
}
function cargar(nombres) {
  for (const n of nombres) { try { return req(n); } catch {} }
  for (const dir of globales()) for (const n of nombres) {
    for (const cand of [path.join(dir, n), path.join(dir, 'playwright', 'node_modules', n)]) {
      if (fs.existsSync(cand)) { try { return req(cand); } catch {} }
    }
  }
  throw new Error(`No se encontró ${nombres.join(' ni ')}. Instalá las dependencias con "npm install" en pipeline/.`);
}
export const { chromium } = cargar(['playwright-core', 'playwright']);
