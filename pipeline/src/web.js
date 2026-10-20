// Versión web de la edición para publicarla como página de Claude (Artifact).
// Toma ediciones/<fecha>/diario.html y genera ediciones/<fecha>/web/index.html:
// - sin <!doctype>/<html>/<head>/<body> (la plataforma agrega el esqueleto),
// - con una barra de pantalla (oculta al imprimir) con el link al PDF en GitHub y las ediciones anteriores,
// - con las páginas A4 escaladas al ancho del teléfono.
// Uso: node src/web.js <carpeta de edición>
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, leerJson, esc, fechaLarga, capitalizar } from './util.js';

const carpeta = path.resolve(process.argv[2] || '.');
const config = leerJson(path.join(RAIZ, 'config', 'edicion.json'));
const contenido = leerJson(path.join(carpeta, 'contenido.json'));
const html = fs.readFileSync(path.join(carpeta, 'diario.html'), 'utf8');
const estilo = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const cuerpo = html.match(/<body>([\s\S]*)<\/body>/)[1];

const repo = config.entrega?.repo_github;
const rama = config.entrega?.rama || 'main';
const fecha = contenido.edicion.fecha;
const pdfDe = f => {
  const dir = path.join(RAIZ, 'ediciones', f);
  const pdf = fs.existsSync(dir) ? fs.readdirSync(dir).find(x => x.endsWith('.pdf')) : null;
  return pdf && repo ? `https://github.com/${repo}/blob/${rama}/ediciones/${f}/${encodeURIComponent(pdf)}` : null;
};
const dirHist = path.join(RAIZ, 'historial', 'ediciones');
const anteriores = (fs.existsSync(dirHist) ? fs.readdirSync(dirHist) : [])
  .filter(f => f.endsWith('.json') && f.slice(0, 10) < fecha).map(f => f.slice(0, 10)).sort().reverse().slice(0, 7);
const pdfHoy = pdfDe(fecha);
const links = anteriores.map(f => ({ f, url: pdfDe(f) })).filter(x => x.url)
  .map(x => `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(capitalizar(fechaLarga(x.f)).replace(/ de \d{4}$/, ''))}</a>`).join('');

const salida = `<title>${esc(config.nombre)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* Una sola apariencia a propósito: papel de diario sobre mesa gris, igual en tema claro y oscuro. */
:root { --mesa: #d9d9d6; --tinta: #111; --tinta-suave: #4a4a48; --papel: #fff; --regla: #9a9a96; }
${estilo}
html, body { background: var(--mesa); }
body { padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 12px 24px; color: var(--tinta); }
.barra { max-width: var(--papel-ancho); margin: 0 auto 10px; font-family: var(--sans); font-size: 13px; color: var(--tinta-suave); display: flex; flex-wrap: wrap; gap: 6px 16px; align-items: baseline; }
.barra b { color: var(--tinta); }
.barra a { color: var(--tinta); text-underline-offset: 2px; }
.barra a:focus-visible { outline: 2px solid var(--tinta); outline-offset: 2px; }
.barra .pdf { font-weight: 700; }
.barra .ant { display: flex; flex-wrap: wrap; gap: 4px 12px; min-width: 0; }
.hojas { --z: 1; }
.hojas .page { zoom: var(--z); margin: 0 auto 12px; box-shadow: 0 1px 4px rgba(0,0,0,.25); }
@media print { .barra { display: none; } html, body { background: #fff; padding: 0; } .hojas .page { zoom: 1; margin: 0; box-shadow: none; } }
</style>
<nav class="barra" aria-label="Edición">
  <span><b>Nº ${contenido.edicion.numero}</b> · ${esc(capitalizar(fechaLarga(fecha)))}</span>
  ${pdfHoy ? `<a class="pdf" href="${esc(pdfHoy)}" target="_blank" rel="noopener">Abrir el PDF para imprimir</a>` : ''}
  ${links ? `<span class="ant">Anteriores: ${links}</span>` : ''}
</nav>
<main class="hojas">
${cuerpo}
</main>
<script>
(function () {
  var hojas = document.querySelector('.hojas');
  var pagina = document.querySelector('.page');
  function ajustar() {
    var disponible = document.documentElement.clientWidth - 32;
    var ancho = pagina.offsetWidth;
    hojas.style.setProperty('--z', String(Math.min(1, disponible / ancho)));
  }
  ajustar();
  window.addEventListener('resize', ajustar);
})();
</script>
`;
const out = path.join(carpeta, 'web');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), salida, 'utf8');
console.log(JSON.stringify({ web: path.join(out, 'index.html'), pdfHoy, anteriores }, null, 2));
