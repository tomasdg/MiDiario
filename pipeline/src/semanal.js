// Paquete semanal para NotebookLM y YouTube.
// Junta las ediciones de los últimos 7 días y arma:
//   semanal/<FECHA>/fuente-notebooklm.md   texto para pegar en NotebookLM como fuente
//   semanal/<FECHA>/web/index.html          página para publicar como Artifact (pasos, fuente y datos de YouTube con botones de copiar)
// Requiere semanal/<FECHA>/editorial.json, escrito por el modelo (ver pipeline/SEMANAL.md):
//   { "titulo_semana", "claves": [{ "titulo", "texto" }], "enfoque_notebooklm",
//     "youtube": { "titulo", "descripcion", "etiquetas": [], "miniatura" } }
// Uso: node src/semanal.js <AAAA-MM-DD>   (fecha de cierre del resumen; incluye ese día y los 6 anteriores)
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, leerJson, esc, fechaLarga, fechaCorta, numero, capitalizar } from './util.js';

const fecha = process.argv[2] || new Date().toISOString().slice(0, 10);
const config = leerJson(path.join(RAIZ, 'config', 'edicion.json'));
const dirSem = path.join(RAIZ, 'semanal', fecha);
const editorial = leerJson(path.join(dirSem, 'editorial.json'));

const dia = s => new Date(s + 'T12:00:00-03:00').getTime();
const desde = new Date(dia(fecha) - 6 * 86400000).toISOString().slice(0, 10);
const fechas = fs.readdirSync(path.join(RAIZ, 'ediciones')).filter(f => /^\d{4}-\d{2}-\d{2}$/.test(f) && f >= desde && f <= fecha).sort();
const ediciones = fechas.map(f => {
  const dir = path.join(RAIZ, 'ediciones', f);
  if (!fs.existsSync(path.join(dir, 'contenido.json'))) return null;
  const c = leerJson(path.join(dir, 'contenido.json'));
  for (const [k, v] of Object.entries(c)) if (typeof v === 'string' && v.startsWith('@')) { try { c[k] = leerJson(path.join(dir, v.slice(1))); } catch { c[k] = null; } }
  return c;
}).filter(Boolean);
if (!ediciones.length) { console.error(`No hay ediciones entre ${desde} y ${fecha}.`); process.exit(1); }

// Notas de la semana, sin repetidas (mismo título o misma primera URL), ordenadas por importancia.
const SECCION = { ia: 'Inteligencia artificial', tecnologia: 'Tecnología', empresas: 'Empresas de tecnología', impresion3d: 'Impresión 3D' };
// Ajustes opcionales del editorial: ids a dejar afuera (breves de agenda ya superados, repetidas) y sección forzada por id.
const excluir = new Set(editorial.excluir || []);
const secciones = editorial.secciones || {};
const vistos = new Set();
const notas = [];
for (const c of ediciones) {
  const principal = { ...c.portada.principal, principal: true, seccion: c.portada.principal.seccion === 'principal' ? inferirSeccion(c) : c.portada.principal.seccion };
  for (const n of [principal, ...c.notas]) {
    if (excluir.has(n.id)) continue;
    const sec = secciones[n.id] || (n.seccion === 'breve' ? n.seccion_destino : n.seccion);
    if (!SECCION[sec]) continue;
    const clave = (n.titulo || '').toLowerCase().trim();
    const url = (n.fuentes?.[0]?.url || '').toLowerCase();
    if (vistos.has(clave) || (url && vistos.has(url))) continue;
    vistos.add(clave); if (url) vistos.add(url);
    notas.push({ ...n, sec, edicion: c.edicion.fecha, peso: (n.importancia || 1) + (n.principal ? 2 : 0) + (n.seccion === 'breve' ? -1 : 0) });
  }
}
function inferirSeccion(c) {
  // La principal no tiene sección propia: se asigna a la sección de la nota con más palabras en común.
  const t = new Set(c.portada.principal.titulo.toLowerCase().split(/\W+/).filter(w => w.length > 4));
  let mejor = 'ia', puntos = -1;
  for (const n of c.notas) {
    const p = n.titulo.toLowerCase().split(/\W+/).filter(w => t.has(w)).length;
    if (p > puntos && SECCION[n.seccion]) { puntos = p; mejor = n.seccion; }
  }
  return puntos > 0 ? mejor : 'ia';
}
notas.sort((a, b) => b.peso - a.peso || b.edicion.localeCompare(a.edicion));

const tips = ediciones.map(c => c.claude_tip && { ...c.claude_tip, edicion: c.edicion.fecha }).filter(Boolean);
const dolares = ediciones.map(c => {
  const of = c.finanzas?.dolar?.find(d => d.clave === 'oficial') || c.finanzas?.dolar?.[0];
  return of && { fecha: (of.actualizado || c.edicion.fecha).slice(0, 10), compra: of.compra, venta: of.venta };
}).filter(Boolean).filter((d, i, a) => a.findIndex(x => x.fecha === d.fecha) === i);
const agenda = [...new Map(ediciones.flatMap(c => c.portada.agenda || []).map(a => [a.texto, a])).values()].slice(-8);

const rango = `${fechaCorta(fechas[0])} al ${fechaCorta(fechas.at(-1))}`;
const nEd = ediciones.map(c => c.edicion.numero);

// ---------- Fuente para NotebookLM ----------
const L = [];
L.push(`# ${config.nombre}: resumen de la semana del ${rango}`, '');
L.push(`Este documento reúne lo más importante de ${ediciones.length} ediciones (Nº ${nEd[0]} a ${nEd.at(-1)}) de ${config.nombre}, un diario personal sobre inteligencia artificial, tecnología, empresas de tecnología e impresión 3D, armado en Villa Urquiza, Buenos Aires. Cada dato tiene su fuente y su fecha.`, '');
L.push(`**En una frase:** ${editorial.titulo_semana}`, "");
L.push('## Las claves de la semana', '');
editorial.claves.forEach((k, i) => L.push(`${i + 1}. **${k.titulo}.** ${k.texto}`));
L.push('');
for (const [sec, nombre] of Object.entries(SECCION)) {
  const lista = notas.filter(n => n.sec === sec);
  if (!lista.length) continue;
  L.push(`## ${nombre}`, '');
  for (const n of lista) {
    L.push(`### ${n.titulo}`);
    L.push(`*${capitalizar(fechaLarga(n.fecha_acontecimiento || n.edicion))}.${n.tipo === 'analisis' ? ' Análisis.' : ''}*`, '');
    if (n.bajada) L.push(n.bajada, '');
    for (const p of n.cuerpo) L.push(p, '');
    L.push(`Fuente: ${n.fuentes.map(f => `${f.medio} (${f.url})`).join('; ')}`, '');
  }
}
if (tips.length) {
  L.push('## Claude Tips de la semana', '');
  for (const t of tips) {
    L.push(`### ${t.titulo}`, `*${t.donde || 'Claude'} · ${t.origen || ''}*`, '');
    for (const p of t.texto) L.push(p, '');
    if (t.pasos?.length) { t.pasos.forEach((p, i) => L.push(`${i + 1}. ${p}`)); L.push(''); }
  }
}
if (dolares.length) {
  L.push('## Dólar oficial en la semana (Banco Nación, cierre)', '');
  for (const d of dolares) L.push(`- ${capitalizar(fechaLarga(d.fecha))}: compra $ ${numero(d.compra, 2)}, venta $ ${numero(d.venta, 2)}`);
  if (dolares.length > 1) {
    const v = (dolares.at(-1).venta - dolares[0].venta) / dolares[0].venta * 100;
    L.push('', `Variación de la venta en el período: ${v >= 0 ? '+' : '−'}${numero(Math.abs(v), 2)}%.`);
  }
  L.push('');
}
if (agenda.length) {
  L.push('## Lo que viene', '');
  for (const a of agenda) L.push(`- ${a.cuando}: ${a.texto}`);
  L.push('');
}
const fuente = L.join('\n');
fs.mkdirSync(path.join(dirSem, 'web'), { recursive: true });
fs.writeFileSync(path.join(dirSem, 'fuente-notebooklm.md'), fuente, 'utf8');

// ---------- Descripción de YouTube ----------
const yt = editorial.youtube;
const fuentesYt = [...new Map(notas.slice(0, 12).flatMap(n => n.fuentes.slice(0, 1)).map(f => [f.url, f])).values()];
const descripcion = `${yt.descripcion}

En este episodio:
${editorial.claves.map(k => `• ${k.titulo}`).join('\n')}

Fuentes principales:
${fuentesYt.map(f => `${f.medio}: ${f.url}`).join('\n')}

Resumen generado con IA a partir de ${config.nombre}, un diario personal que se arma cada mañana con fuentes verificadas.`;
fs.writeFileSync(path.join(dirSem, 'youtube.json'), JSON.stringify({ titulo: yt.titulo, descripcion, etiquetas: yt.etiquetas, miniatura: yt.miniatura }, null, 2), 'utf8');

// ---------- Página ----------
const palabras = fuente.split(/\s+/).length;
const bloque = (id, etiqueta, texto, alto = '') => `<section class="bloque">
  <div class="cab"><h2 id="${id}-t">${etiqueta}</h2><button type="button" class="copiar" data-de="${id}" aria-describedby="${id}-t">Copiar</button></div>
  <pre id="${id}" class="texto ${alto}" tabindex="0">${esc(texto)}</pre>
</section>`;
const pagina = `<title>${esc(config.nombre)} · Semanal</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* Hoja de trabajo semanal: una columna, pasos arriba y bloques para copiar debajo. Monocromo como el diario. */
:root { --fondo: #f3f3f1; --hoja: #ffffff; --tinta: #151514; --suave: #5c5c58; --regla: #cfcfca; --marca: #151514; --ok: #1d6b3a;
  --serif: Georgia, 'Times New Roman', serif; --sans: system-ui, 'Segoe UI', Roboto, Arial, sans-serif; --mono: ui-monospace, Consolas, monospace; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --fondo: #161615; --hoja: #20201f; --tinta: #ecece8; --suave: #a3a39d; --regla: #3a3a37; --marca: #ecece8; --ok: #6fcf94; color-scheme: dark; } }
:root[data-theme="dark"] { --fondo: #161615; --hoja: #20201f; --tinta: #ecece8; --suave: #a3a39d; --regla: #3a3a37; --marca: #ecece8; --ok: #6fcf94; color-scheme: dark; }
body { background: var(--fondo); color: var(--tinta); font-family: var(--sans); font-size: 15px; line-height: 1.5;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 20px 40px; }
.hoja { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
header { border-bottom: 2px solid var(--marca); padding-bottom: 10px; }
header h1 { font-family: var(--serif); font-size: clamp(26px, 5vw, 38px); line-height: 1.05; margin: 0; text-wrap: balance; }
header .sub { display: flex; flex-wrap: wrap; gap: 4px 16px; margin-top: 8px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--suave); }
.semana { font-family: var(--serif); font-size: 20px; line-height: 1.25; margin: 0; text-wrap: balance; }
h2 { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; margin: 0; }
.pasos { background: var(--hoja); border: 1px solid var(--regla); padding: 16px 18px; }
.pasos ol { margin: 10px 0 0; padding-left: 22px; display: flex; flex-direction: column; gap: 8px; }
.pasos li { max-width: 65ch; }
.claves { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; list-style: none; }
.claves li { border-left: 3px solid var(--marca); padding-left: 12px; max-width: 65ch; }
.claves b { font-family: var(--serif); font-size: 17px; display: block; }
.bloque { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.cab { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.texto { margin: 0; background: var(--hoja); border: 1px solid var(--regla); padding: 12px 14px; font-family: var(--mono); font-size: 13px; line-height: 1.45;
  white-space: pre-wrap; word-break: break-word; overflow: auto; min-width: 0; }
.texto.alto { max-height: 340px; }
.texto:focus-visible, .copiar:focus-visible { outline: 2px solid var(--marca); outline-offset: 2px; }
.copiar { font: inherit; font-size: 13px; font-weight: 600; padding: 6px 14px; background: var(--marca); color: var(--hoja); border: 0; cursor: pointer; }
.copiar.hecho { background: var(--ok); }
.nota { font-size: 13px; color: var(--suave); max-width: 65ch; margin: 0; }
</style>
<main class="hoja">
  <header>
    <h1>${esc(config.nombre)}</h1>
    <div class="sub"><span>Resumen semanal</span><span>${esc(rango)}</span><span>Ediciones Nº ${nEd[0]} a ${nEd.at(-1)}</span><span>${numero(notas.length)} notas · ${numero(palabras)} palabras</span></div>
  </header>
  <p class="semana">${esc(editorial.titulo_semana)}</p>
  <section class="pasos">
    <h2>Cómo hacer el video (unos 10 minutos)</h2>
    <ol>
      <li>Abrí <a href="https://notebooklm.google.com" target="_blank" rel="noopener">NotebookLM</a> con tu cuenta personal de Google y creá un cuaderno nuevo.</li>
      <li>En <b>Agregar fuente</b>, elegí <b>Texto copiado</b>, tocá <b>Copiar</b> en «Fuente para NotebookLM» acá abajo y pegalo.</li>
      <li>En el panel de la derecha, elegí el resumen en video (o en audio, para podcast) y entrá a <b>Personalizar</b>. Copiá ahí las «Instrucciones para NotebookLM».</li>
      <li>Generalo, miralo entero y descargalo.</li>
      <li>En YouTube Studio, subilo con el título, la descripción y las etiquetas de abajo. Si YouTube pregunta por contenido alterado o sintético, marcá que sí: las voces son de IA.</li>
    </ol>
  </section>
  <section class="bloque"><h2>Las claves de la semana</h2>
    <ol class="claves">${editorial.claves.map(k => `<li><b>${esc(k.titulo)}</b>${esc(k.texto)}</li>`).join('')}</ol>
  </section>
  ${bloque('fuente', 'Fuente para NotebookLM', fuente, 'alto')}
  ${bloque('enfoque', 'Instrucciones para NotebookLM', editorial.enfoque_notebooklm)}
  ${bloque('yt-titulo', 'Título de YouTube', yt.titulo)}
  ${bloque('yt-desc', 'Descripción de YouTube', descripcion, 'alto')}
  ${bloque('yt-tags', 'Etiquetas', yt.etiquetas.join(', '))}
  ${bloque('yt-mini', 'Texto para la miniatura', yt.miniatura)}
  <p class="nota">Cada domingo esta página se reemplaza por la semana nueva. El texto también queda guardado en el repositorio del diario, en semanal/${esc(fecha)}.</p>
</main>
<script>
document.querySelectorAll('.copiar').forEach(function (b) {
  b.addEventListener('click', function () {
    var el = document.getElementById(b.dataset.de);
    var listo = function () { b.textContent = 'Copiado'; b.classList.add('hecho'); setTimeout(function () { b.textContent = 'Copiar'; b.classList.remove('hecho'); }, 1800); };
    var seleccionar = function () { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Seleccionado: Ctrl+C'; };
    try { navigator.clipboard.writeText(el.textContent).then(listo, seleccionar); } catch (e) { seleccionar(); }
  });
});
</script>
`;
fs.writeFileSync(path.join(dirSem, 'web', 'index.html'), pagina, 'utf8');
console.log(JSON.stringify({ desde, hasta: fecha, ediciones: fechas, notas: notas.length, tips: tips.length, palabras, salida: dirSem }, null, 2));
