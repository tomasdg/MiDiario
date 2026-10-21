// Transforma el JSON de contenido en el HTML paginado del diario.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, parrafo, precio, porcentaje, numero, fechaLarga, fechaCorta, fechaNumerica, horaMin, fechaHora, diaSemana, capitalizar } from './util.js';
import { graficoLinea } from './charts.js';
import { iconoPorWmo, svgIcono } from './icons.js';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const CSS = fs.readFileSync(path.join(AQUI, '..', 'templates', 'diario.css'), 'utf8');
// Fuentes incrustadas: el preflight y la pantalla del lector ven exactamente la misma tipografía.
const DIR_FUENTES = path.join(AQUI, '..', 'assets', 'fonts');
const cara = (familia, archivo, peso, estilo) => `@font-face{font-family:'${familia}';src:url(data:font/woff;base64,${fs.readFileSync(path.join(DIR_FUENTES, archivo)).toString('base64')}) format('woff');font-weight:${peso};font-style:${estilo};font-display:block}`;
const FUENTES = [
  cara('Diario Serif', 'lora.woff', '400 700', 'normal'),
  cara('Diario Serif', 'lora-italic.woff', '400 700', 'italic'),
  cara('Diario Sans', 'inter.woff', '400', 'normal'),
  cara('Diario Sans', 'inter-bold.woff', '600 800', 'normal'),
].join('\n');

const NOMBRE_SECCION = {
  portada: 'Portada', ia: 'Inteligencia artificial y Claude Tips', tecnologia_empresas: 'Tecnología y empresas', impresion3d_cierre: 'Impresión 3D, dólar y clima',
};
const KICKER = {
  principal: 'Nota principal', ia: 'Inteligencia artificial', tecnologia: 'Tecnología', empresas: 'Empresas', impresion3d: 'Impresión 3D', breve: 'Breve',
};

/**
 * @param {object} contenido JSON validado
 * @param {object} config config/edicion.json
 * @param {object} [opciones] { cuerpos: number[] (pt por página), columnas: number }
 */
export function render(contenido, config, opciones = {}) {
  const papel = config.papel.formatos[contenido.edicion.papel || config.papel.actual];
  const mapa = config.mapa_paginas;
  const total = mapa.length;
  const cuerpos = opciones.cuerpos || mapa.map(() => config.tipografia.cuerpo_pt.por_defecto);
  const ctx = { contenido, config, total, papel, fechaLarga: fechaLarga(contenido.edicion.fecha) };

  const paginas = mapa.map((m, i) => {
    const n = i + 1;
    const estilo = `--cuerpo:${cuerpos[i]}pt; --columnas:${opciones.columnas || papel.columnas_max}`;
    let cuerpo;
    switch (m.nombre) {
      case 'portada': cuerpo = portada(ctx); break;
      case 'impresion3d_cierre': cuerpo = cierre(ctx, m.secciones, n); break;
      default: cuerpo = flujo(ctx, m.secciones, n);
    }
    const header = m.nombre === 'portada' ? masthead(ctx) :
      `<header class="ph"><span><span class="ph-seccion">${esc(config.nombre)}</span> · ${esc(NOMBRE_SECCION[m.nombre] || m.nombre)}</span><span>${esc(ctx.fechaLarga)} · <b class="ph-num">${n}</b></span></header>`;
    return `<section class="page" data-pagina="${n}" data-nombre="${esc(m.nombre)}" style="${estilo}">
      ${header}
      <div class="pb">${cuerpo}</div>
      <footer class="pf"><span>Nº ${contenido.edicion.numero} · ${esc(contenido.edicion.lugar)}</span><span>Página <b class="pf-num">${n}</b> de ${total}</span></footer>
    </section>`;
  });

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>${esc(config.nombre)} Nº ${contenido.edicion.numero}</title>
<style>${FUENTES}
:root{--papel-ancho:${papel.ancho_mm}mm;--papel-alto:${papel.alto_mm}mm;--margen:${papel.margen_mm}mm;}
${CSS}</style></head><body>${paginas.join('\n')}</body></html>`;
}

/* ---------- Portada ---------- */
function masthead(ctx) {
  const { contenido, config } = ctx;
  return `<header class="ph masthead"><h1>${esc(config.nombre)}</h1>
    <div class="sub"><span>Nº ${contenido.edicion.numero}</span><span>${esc(capitalizar(ctx.fechaLarga))}</span><span>${esc(contenido.edicion.lugar)}</span></div></header>`;
}

function portada(ctx) {
  const { contenido: c } = ctx;
  const p = c.portada;
  const clima = c.clima.dias.slice(0, 2).map(d => {
    const ic = iconoPorWmo(d.codigo_wmo);
    return `<div class="dia">${svgIcono(ic.nombre)}<div class="t"><div><b>${numero(d.max, 0)}°</b> / ${numero(d.min, 0)}°</div><div>${esc(capitalizar(diaSemana(d.fecha)))} · ${esc(ic.texto)}</div></div></div>`;
  }).join('') || '<p class="nd-strip">Dato no disponible al cierre.</p>';
  const of = c.finanzas.dolar.find(d => (d.clave || '').toLowerCase() === 'oficial') || c.finanzas.dolar[0];
  const ant = c.finanzas.anterior;
  const varOf = of && ant?.venta ? (of.venta - ant.venta) / ant.venta * 100 : null;
  const filasCot = of ? `<tr><td>Compra</td><td class="v">$ ${numero(of.compra, 2)}</td></tr><tr><td>Venta</td><td class="v"><b>$ ${numero(of.venta, 2)}</b></td></tr>${varOf !== null ? `<tr><td>Vs. edición anterior</td><td class="v">${porcentaje(varOf, 2)}</td></tr>` : ''}<tr><td>Actualizado</td><td class="v">${esc(fechaHora(of.actualizado))}</td></tr>` : '<tr><td colspan="2">Dato no disponible al cierre.</td></tr>';
  const dd = p.dato_del_dia || (c.glosario[0] && { etiqueta: 'Término del día', titulo: c.glosario[0].termino, texto: c.glosario[0].definicion });
  const secundarias = p.secundarias.map(s => `<div class="sec"><h4>${esc(s.titulo)}</h4><p>${parrafo(s.resumen)}${s.pagina ? ` <span class="pg">Pág. ${s.pagina}</span>` : ''}</p></div>`).join('');
  const llamadas = (p.llamadas || []).map(l => `<div class="llamada"><span class="et">${esc(l.etiqueta)}</span>${parrafo(l.texto)}${l.pagina ? ` <span class="pg">Pág. ${l.pagina}</span>` : ''}</div>`).join('');
  const pr = p.principal;
  const agenda = p.agenda?.length ? `<div class="agenda"><h3>Agenda</h3><ul>${p.agenda.map(a => `<li><b>${esc(a.cuando)}.</b> ${parrafo(a.texto)}</li>`).join('')}</ul></div>` : '';
  return `
  <div class="strip">
    <div><h4>Clima en ${esc(c.clima.lugar)}</h4><div class="strip-clima">${clima}</div></div>
    <div class="strip-cot"><h4>Dólar oficial (BNA)</h4><table>${filasCot}</table></div>
    <div class="strip-disco"><h4>${esc(dd?.etiqueta || 'Dato del día')}</h4>${dd ? `<b>${esc(dd.titulo)}.</b> <span class="just">${parrafo(dd.texto)}</span>` : ''}</div>
  </div>
  <div class="portada-main">
    <article class="principal art tipo-${esc(pr.tipo)}">
      <div class="kicker">${esc(KICKER[pr.seccion] || pr.seccion)} · ${esc(fechaCorta(pr.fecha_acontecimiento))}</div>
      <h2 class="tit">${parrafo(pr.titulo)}</h2>
      ${pr.bajada ? `<p class="bajada">${parrafo(pr.bajada)}</p>` : ''}
      <div class="cuerpo">${pr.cuerpo.map(x => `<p>${parrafo(x)}</p>`).join('')}${fuentes(pr)}</div>
      ${agenda}
    </article>
    <aside class="secundarias"><h3>En esta edición</h3>${secundarias}</aside>
  </div>
  ${llamadas ? `<div class="llamadas" style="--n-llamadas:${p.llamadas.length}">${llamadas}</div>` : ''}`;
}

/* ---------- Páginas de flujo ---------- */
function flujo(ctx, secciones, pagina, clase = '') {
  const { contenido: c } = ctx;
  const notas = c.notas
    .filter(n => (n.pagina ? n.pagina === pagina : secciones.includes(n.seccion)) && n.seccion !== 'breve')
    .sort((a, b) => (b.importancia || 0) - (a.importancia || 0));
  const breves = c.notas.filter(n => n.seccion === 'breve' && (n.pagina ? n.pagina === pagina : secciones.includes(n.seccion_destino || 'ia')));
  const nd = (c.no_disponible || []).filter(x => x.pagina === pagina).map(noDisponible).join('');
  const tip = secciones.includes('ia') && c.claude_tip ? claudeTip(c.claude_tip) : '';
  const html = notas.map((n, i) => articulo(n, i === 0)).join('');
  const brevesHtml = breves.length ? `<div class="breves"><h3>Breves</h3>${breves.map(b => `<p class="breve"><b>${esc(b.titulo)}.</b> ${parrafo(b.cuerpo.join(' '))} <span class="f">${esc(b.fuentes[0]?.medio || '')}, ${esc(fechaCorta(b.fecha_acontecimiento))}</span></p>`).join('')}</div>` : '';
  return `<div class="flow ${clase}">${html}${nd}${brevesHtml}${tip}</div>`;
}

function claudeTip(t) {
  const pasos = t.pasos?.length ? `<ol>${t.pasos.map(p => `<li>${parrafo(p)}</li>`).join('')}</ol>` : '';
  return `<aside class="tip">
    <div class="tip-et">Claude Tips${t.donde ? ` · ${esc(t.donde)}` : ''}</div>
    <h2 class="tit">${parrafo(t.titulo)}</h2>
    ${t.bajada ? `<p class="bajada">${parrafo(t.bajada)}</p>` : ''}
    ${t.texto.map(x => `<p>${parrafo(x)}</p>`).join('')}
    ${pasos}
    <p class="fuente">${t.origen ? `${esc(t.origen)} · ` : ''}${t.fuentes.map(f => `${esc(f.medio)}${f.fecha_publicacion ? `, ${esc(fechaCorta(f.fecha_publicacion))}` : ''}`).join(' · ')}</p>
  </aside>`;
}

function articulo(n, lead) {
  const fecha = n.fecha_acontecimiento ? fechaCorta(n.fecha_acontecimiento) : '';
  return `<article class="art ${lead ? 'lead' : ''} tipo-${esc(n.tipo)}" data-id="${esc(n.id)}" data-recorte="${esc(n.recorte || '')}">
    <div class="kicker">${esc(KICKER[n.seccion] || n.seccion)}${fecha ? ` · ${esc(fecha)}` : ''}</div>
    <h2 class="tit">${parrafo(n.titulo)}</h2>
    ${n.bajada ? `<p class="bajada">${parrafo(n.bajada)}</p>` : ''}
    <div class="cuerpo">${n.cuerpo.map(x => `<p>${parrafo(x)}</p>`).join('')}</div>
    ${fuentes(n)}
  </article>`;
}

function fuentes(n) {
  if (!n.fuentes || !n.fuentes.length) return '';
  const vistos = new Set();
  const partes = [];
  for (const f of n.fuentes) {
    const k = `${f.medio}|${f.fecha_publicacion || ''}`;
    if (vistos.has(k)) continue;
    vistos.add(k);
    partes.push(`${esc(f.medio)}${f.fecha_publicacion ? `, ${esc(fechaCorta(f.fecha_publicacion))}` : ''}`);
  }
  return `<p class="fuente">${partes.join(' · ')}</p>`;
}

function noDisponible(x) {
  return `<div class="nd"><b>Dato no disponible al cierre:</b> ${esc(x.dato)}. Fuente intentada: ${esc(x.fuente_intentada)}, ${esc(fechaHora(x.hora_intento))}.${x.motivo ? ` ${esc(x.motivo)}` : ''}</div>`;
}

/* ---------- Página de cierre: impresión 3D + dólar, clima, glosario y fuentes ---------- */
function cierre(ctx, secciones, pagina) {
  const { contenido: c } = ctx;
  const f = c.finanzas, cl = c.clima;
  const of = f.dolar.find(d => (d.clave || '').toLowerCase() === 'oficial') || f.dolar[0];
  const ant = f.anterior;
  const dif = of && ant?.venta ? of.venta - ant.venta : null;
  const dolar = of ? `<div class="dolar">
      <div class="dolar-cifras"><div><span class="et">Compra</span><span class="num">$ ${numero(of.compra, 2)}</span></div><div><span class="et">Venta</span><span class="num">$ ${numero(of.venta, 2)}</span></div></div>
      ${dif !== null ? `<p class="datos">Edición anterior (${esc(fechaCorta(ant.fecha))}): venta $ ${numero(ant.venta, 2)} · variación ${dif > 0 ? '+' : dif < 0 ? '−' : ''}$ ${numero(Math.abs(dif), 2)} (${porcentaje(dif / ant.venta * 100, 2)}).</p>` : ''}
      ${f.comentario ? `<p class="obs">${parrafo(f.comentario)}</p>` : ''}
      <p class="aviso">Cotización del Banco Nación vía DolarApi, actualizada ${esc(fechaHora(of.actualizado))} hora argentina. No es recomendación de inversión.</p>
    </div>` : '';
  const ndFin = (f.no_disponible || []).map(noDisponible).join('');
  const dias = cl.dias.map(x => {
    const ic = iconoPorWmo(x.codigo_wmo);
    return `<div class="dia"><div class="d">${esc(diaSemana(x.fecha).slice(0, 3))} ${esc(fechaCorta(x.fecha))}</div>${svgIcono(ic.nombre)}<div class="tt"><b>${numero(x.max, 0)}°</b> / ${numero(x.min, 0)}°</div><div>${esc(ic.texto)}</div></div>`;
  }).join('');
  const conProb = cl.dias.some(x => x.prob_precip !== undefined), conRaf = cl.dias.some(x => x.rafagas_kmh !== undefined);
  const filas = cl.dias.map(x => `<tr><td class="l">${esc(capitalizar(diaSemana(x.fecha)).slice(0, 3))} ${esc(fechaCorta(x.fecha))}</td><td>${x.precip_mm !== undefined ? numero(x.precip_mm, 1) + ' mm' : '—'}</td>${conProb ? `<td>${x.prob_precip !== undefined ? numero(x.prob_precip, 0) + '%' : '—'}</td>` : ''}<td>${x.viento_kmh !== undefined ? numero(x.viento_kmh, 0) : '—'}${x.rafagas_kmh !== undefined ? ` (${numero(x.rafagas_kmh, 0)})` : ''}</td></tr>`).join('');
  const glos = c.glosario.map(g => `<dt>${esc(g.termino)}</dt><dd>${parrafo(g.definicion)}${g.ejemplo ? ` <span class="ej">${parrafo(g.ejemplo)}</span>` : ''}</dd>`).join('');
  const erratas = c.fe_de_erratas.length ? c.fe_de_erratas.map(e => `<p>${parrafo(e)}</p>`).join('') : '<p>Sin correcciones a la edición anterior.</p>';
  const medios = {};
  for (const n of [c.portada.principal, ...c.notas, c.claude_tip].filter(Boolean)) for (const x of n.fuentes || []) medios[x.medio] = (medios[x.medio] || 0) + 1;
  const listaMedios = Object.entries(medios).sort((a, b) => b[1] - a[1]).map(([m, k]) => `${esc(m)}${k > 1 ? ` (${k})` : ''}`).join(', ');
  return `<div class="cierre">
    ${flujo(ctx, secciones, pagina, 'c2')}
    <div class="col">
      <div><h3 class="h3">Dólar oficial</h3>${dolar}${ndFin}</div>
      <div class="clima">
        <h3 class="h3">Clima en ${esc(cl.lugar)}</h3>
        ${cl.dias.length ? `<div class="dias">${dias}</div>
        <table class="tabla"><thead><tr><th class="l">Día</th><th>Lluvia</th>${conProb ? '<th>Prob.</th>' : ''}<th>${conRaf ? 'Viento (ráf.)' : 'Viento máx.'}</th></tr></thead><tbody>${filas}</tbody></table>
        ${cl.cambio_brusco ? `<p class="obs"><b>Cambio de temperatura:</b> ${parrafo(cl.cambio_brusco)}</p>` : ''}
        ${cl.alertas ? `<p class="obs"><b>Alertas:</b> ${parrafo(cl.alertas)}</p>` : ''}
        <p class="aviso">Fuente: ${esc(cl.fuente)}, consultado ${esc(fechaHora(cl.corte))} hora argentina. Viento en km/h.</p>` : (cl.no_disponible || []).map(noDisponible).join('')}
      </div>
      <div><h3 class="h3">Glosario</h3><dl class="glos">${glos}</dl></div>
      <div class="erratas"><h3 class="h3">Fe de erratas</h3>${erratas}</div>
      <p class="fuentes-ed"><b>Medios consultados:</b> ${listaMedios}. <b>Datos:</b> ${esc(cl.fuente)}, DolarApi (BNA). Cada nota indica su fuente y fecha al pie.</p>
      <p class="pie-legal">${esc(ctx.config.nombre)} es una publicación de uso personal, generada con asistencia de IA y verificada al cierre (${esc(fechaHora(c.edicion.cierre))} hora argentina).</p>
    </div>
  </div>`;
}
