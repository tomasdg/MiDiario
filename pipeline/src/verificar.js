// Verificaciones de contenido: esquema, trazabilidad, frescura y anti-repetición contra el historial.
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, leerJson } from './util.js';

// Validador mínimo de JSON Schema (el subconjunto que usa esquema/contenido.schema.json),
// para no depender de Ajv: type, required, properties, additionalProperties:false, items,
// minItems/maxItems, enum, const, minimum/maximum, $ref a #/$defs y formatos date/date-time.
function validar(esq, v, raiz, ruta, errores) {
  if (esq.$ref) esq = esq.$ref.split('/').slice(1).reduce((o, k) => o[k], raiz);
  const tipoDe = x => x === null ? 'null' : Array.isArray(x) ? 'array' : Number.isInteger(x) ? 'integer' : typeof x;
  if (esq.type) {
    const tipos = [].concat(esq.type);
    const t = tipoDe(v);
    if (!tipos.includes(t) && !(t === 'integer' && tipos.includes('number'))) { errores.push({ ruta, mensaje: `debe ser ${tipos.join('|')}` }); return; }
  }
  if (esq.enum && !esq.enum.includes(v)) errores.push({ ruta, mensaje: `debe ser uno de ${esq.enum.join(', ')}` });
  if ('const' in esq && v !== esq.const) errores.push({ ruta, mensaje: `debe ser ${esq.const}` });
  if (typeof v === 'number') {
    if (esq.minimum !== undefined && v < esq.minimum) errores.push({ ruta, mensaje: `mínimo ${esq.minimum}` });
    if (esq.maximum !== undefined && v > esq.maximum) errores.push({ ruta, mensaje: `máximo ${esq.maximum}` });
  }
  if (typeof v === 'string' && esq.format) {
    const re = esq.format === 'date' ? /^\d{4}-\d{2}-\d{2}$/ : esq.format === 'date-time' ? /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/ : null;
    if (re && !re.test(v)) errores.push({ ruta, mensaje: `formato ${esq.format}` });
  }
  if (Array.isArray(v)) {
    if (esq.minItems !== undefined && v.length < esq.minItems) errores.push({ ruta, mensaje: `mínimo ${esq.minItems} elementos` });
    if (esq.maxItems !== undefined && v.length > esq.maxItems) errores.push({ ruta, mensaje: `máximo ${esq.maxItems} elementos` });
    if (esq.items) v.forEach((x, i) => validar(esq.items, x, raiz, `${ruta}/${i}`, errores));
  } else if (v && typeof v === 'object') {
    for (const k of esq.required || []) if (!(k in v)) errores.push({ ruta, mensaje: `falta "${k}"` });
    for (const [k, x] of Object.entries(v)) {
      if (esq.properties?.[k]) validar(esq.properties[k], x, raiz, `${ruta}/${k}`, errores);
      else if (esq.additionalProperties === false) errores.push({ ruta, mensaje: `propiedad no permitida "${k}"` });
    }
  }
}

export function validarEsquema(contenido) {
  const esquema = leerJson(path.join(RAIZ, 'esquema', 'contenido.schema.json'));
  const errores = [];
  validar(esquema, contenido, esquema, '', errores);
  return { ok: errores.length === 0, errores };
}

export function verificarContenido(contenido, config) {
  const errores = [];
  const avisos = [];
  const cierre = new Date(contenido.edicion.cierre).getTime();
  const ventanaMs = config.ventana_frescura_horas * 3600 * 1000;
  const notas = [contenido.portada.principal, ...contenido.notas];

  for (const n of notas) {
    if (!n.fuentes || !n.fuentes.some(f => f.url && /^https?:\/\//.test(f.url))) errores.push({ tipo: 'sin_fuente_url', nota: n.id });
    if (n.sensible_al_tiempo) {
      const fresca = (n.fuentes || []).some(f => f.consultado && cierre - new Date(f.consultado).getTime() <= ventanaMs && cierre - new Date(f.consultado).getTime() >= -3600 * 1000);
      if (!fresca) errores.push({ tipo: 'fuente_fuera_de_ventana', nota: n.id });
    }
    if (!n.fecha_acontecimiento) errores.push({ tipo: 'sin_fecha_acontecimiento', nota: n.id });
  }
  const ids = new Set();
  for (const n of notas) { if (ids.has(n.id)) errores.push({ tipo: 'id_repetido', nota: n.id }); ids.add(n.id); }
  const corteFin = new Date(contenido.finanzas.corte).getTime();
  if (contenido.finanzas.dolar.length && cierre - corteFin > 36 * 3600 * 1000) errores.push({ tipo: 'dolar_corte_viejo', horas: Math.round((cierre - corteFin) / 3600000) });
  const corteClima = new Date(contenido.clima.corte).getTime();
  if (cierre - corteClima > 12 * 3600 * 1000) errores.push({ tipo: 'clima_corte_viejo' });
  if (contenido.glosario.length < config.glosario.min || contenido.glosario.length > config.glosario.max) errores.push({ tipo: 'glosario_fuera_de_rango', cantidad: contenido.glosario.length });

  // Anti-repetición: términos de glosario de los últimos días (error) y títulos o URLs ya publicados (aviso).
  const dir = path.join(RAIZ, 'historial', 'ediciones');
  const previos = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json') && f < contenido.edicion.fecha).sort().slice(-14).map(f => leerJson(path.join(dir, f))) : [];
  const norm = s => (s || '').toString().trim().toLowerCase();
  const urlsHoy = new Set(notas.flatMap(n => (n.fuentes || []).map(f => norm(f.url))));
  for (const e of previos) {
    for (const g of e.glosario || []) if (contenido.glosario.some(x => norm(x.termino) === norm(g))) errores.push({ tipo: 'termino_glosario_repetido', termino: g, edicion: e.fecha });
    for (const t of e.temas || []) {
      if (notas.some(n => norm(n.titulo) === norm(t.titulo) && !n.repeticion_autorizada)) errores.push({ tipo: 'titulo_repetido', titulo: t.titulo, edicion: e.fecha });
      for (const u of t.urls || []) if (urlsHoy.has(norm(u))) avisos.push({ tipo: 'fuente_ya_usada', url: u, edicion: e.fecha });
    }
  }
  // Claude Tips: no repetir el mismo tip (título o URL) en los últimos 30 registros.
  const tip = contenido.claude_tip;
  if (tip && !tip.repeticion_autorizada) {
    const todos = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json') && f < contenido.edicion.fecha).sort().slice(-30).map(f => leerJson(path.join(dir, f))) : [];
    for (const e of todos) {
      if (!e.claude_tip) continue;
      if (norm(e.claude_tip.titulo) === norm(tip.titulo) || (e.claude_tip.urls || []).some(u => tip.fuentes.some(f => norm(f.url) === norm(u)))) errores.push({ tipo: 'claude_tip_repetido', titulo: e.claude_tip.titulo, edicion: e.fecha });
    }
  }
  return { ok: errores.length === 0, errores, avisos };
}

export function registroEdicion(contenido, preflight) {
  const of = contenido.finanzas.dolar.find(d => (d.clave || '').toLowerCase() === 'oficial') || contenido.finanzas.dolar[0];
  return {
    numero: contenido.edicion.numero,
    fecha: contenido.edicion.fecha,
    cierre: contenido.edicion.cierre,
    paginas: preflight.paginas,
    temas: [contenido.portada.principal, ...contenido.notas].map(n => ({ seccion: n.seccion, titulo: n.titulo, urls: (n.fuentes || []).map(f => f.url) })),
    glosario: contenido.glosario.map(g => g.termino),
    claude_tip: contenido.claude_tip ? { titulo: contenido.claude_tip.titulo, urls: contenido.claude_tip.fuentes.map(f => f.url) } : null,
    dolar_oficial: of ? { compra: of.compra, venta: of.venta, fecha: contenido.edicion.fecha } : null,
    fuentes_datos: [contenido.clima.fuente, 'DolarApi'],
    preflight: { ok: preflight.ok, generado: preflight.generado },
  };
}
