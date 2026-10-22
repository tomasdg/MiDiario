// Arma las secciones estructuradas (finanzas = dólar oficial, y clima) a partir de las respuestas crudas
// de las APIs guardadas en <edicion>/datos/.
// Uso: node src/datos.js <carpeta de edición> <AAAA-MM-DD>
// Archivos de entrada en <edicion>/datos/:
//   dolar_oficial.json         respuesta de https://dolarapi.com/v1/dolares/oficial
//   clima_metno.json           pronóstico de MET Norway resumido por día (ver config/fuentes.json):
//                              { "updated_at": ISO, "dias": [{ fecha, max_c, min_c, precip_mm, viento_max_kmh, symbol_code }] }
//   meteo.json (alternativa)   respuesta cruda de Open-Meteo, si se pudo descargar
//   consultado_meteo_utc.txt   hora UTC de la consulta del clima (ISO)
//   comentarios.json (opcional) { "finanzas": "...", "clima_fuente": "...", "clima_alertas": "...", "clima_cambio_brusco": "...", "dolar_motivo": "...", "clima_motivo": "..." }
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, leerJson, escribirJson } from './util.js';

const carpeta = path.resolve(process.argv[2] || '.');
const hoy = process.argv[3] || new Date().toISOString().slice(0, 10);
const dir = path.join(carpeta, 'datos');
const config = leerJson(path.join(RAIZ, 'config', 'edicion.json'));
const leerSi = f => fs.existsSync(path.join(dir, f)) ? leerJson(path.join(dir, f)) : null;
const comentarios = leerSi('comentarios.json') || {};
const ahora = new Date().toISOString();

// ---- Dólar oficial ----
const noDisponible = [];
const crudo = leerSi('dolar_oficial.json');
const lista = Array.isArray(crudo) ? crudo : crudo ? [crudo] : [];
const nombresCasa = { oficial: 'Oficial (BNA)', blue: 'Blue', bolsa: 'MEP (bolsa)', contadoconliqui: 'Contado con liqui', mayorista: 'Mayorista', tarjeta: 'Tarjeta' };
const dolar = lista.filter(d => config.dolar.casas.includes(d.casa) && typeof d.venta === 'number')
  .map(d => ({ casa: nombresCasa[d.casa] || d.casa, clave: d.casa, compra: d.compra, venta: d.venta, actualizado: d.fechaActualizacion }));
if (!dolar.length) noDisponible.push({ dato: 'Cotización del dólar oficial', fuente_intentada: 'DolarApi /v1/dolares/oficial', hora_intento: ahora, motivo: comentarios.dolar_motivo || 'Sin respuesta válida de la API.' });

// Valor de la edición anterior, para la variación diaria.
const dirHist = path.join(RAIZ, 'historial', 'ediciones');
const ultima = fs.existsSync(dirHist) ? fs.readdirSync(dirHist).filter(f => f.endsWith('.json') && f < hoy).sort().at(-1) : null;
const anterior = ultima ? leerJson(path.join(dirHist, ultima)).dolar_oficial || null : null;

const finanzas = {
  corte: dolar[0]?.actualizado || ahora,
  dolar,
  anterior,
  comentario: comentarios.finanzas || '',
  fuente: comentarios.dolar_fuente || 'DolarApi',
  no_disponible: noDisponible,
};

// ---- Clima ----
// symbol_code de MET Norway → código WMO, para reutilizar los iconos.
function wmoDeSimbolo(s = '') {
  const b = s.replace(/_(day|night|polartwilight)$/, '');
  if (/thunder/.test(b)) return 95;
  if (/snow|sleet/.test(b)) return 71;
  if (/heavyrain/.test(b)) return 65;
  if (/lightrain/.test(b)) return 61;
  if (/rain/.test(b)) return 63;
  if (b === 'fog') return 45;
  if (b === 'cloudy') return 3;
  if (b === 'partlycloudy') return 2;
  if (b === 'fair') return 1;
  if (b === 'clearsky') return 0;
  return 3;
}
const metno = leerSi('clima_metno.json');
const meteo = leerSi('meteo.json');
let todos, consultado, fuenteClima;
if (metno) {
  consultado = metno.updated_at || ahora;
  fuenteClima = comentarios.clima_fuente || 'MET Norway (api.met.no)';
  todos = metno.dias.map(d => ({ fecha: d.fecha, codigo_wmo: wmoDeSimbolo(d.symbol_code), max: d.max_c, min: d.min_c, precip_mm: d.precip_mm, prob_precip: d.prob_precip, viento_kmh: d.viento_max_kmh, rafagas_kmh: d.rafagas_kmh }));
} else if (meteo) {
  consultado = fs.existsSync(path.join(dir, 'consultado_meteo_utc.txt')) ? fs.readFileSync(path.join(dir, 'consultado_meteo_utc.txt'), 'utf8').trim() : ahora;
  fuenteClima = 'Open-Meteo';
  const dd = meteo.daily;
  todos = dd.time.map((t, i) => ({ fecha: t, codigo_wmo: dd.weather_code[i], max: dd.temperature_2m_max[i], min: dd.temperature_2m_min[i], precip_mm: dd.precipitation_sum?.[i], prob_precip: dd.precipitation_probability_max?.[i], viento_kmh: dd.wind_speed_10m_max?.[i], rafagas_kmh: dd.wind_gusts_10m_max?.[i] }));
} else {
  // Ninguna fuente de clima respondió: se publica "dato no disponible", nunca un pronóstico inferido.
  consultado = ahora;
  fuenteClima = 'MET Norway (api.met.no)';
  todos = [];
}
const ndClima = todos.length ? [] : [{ dato: 'Pronóstico del clima', fuente_intentada: 'MET Norway (api.met.no)', hora_intento: ahora, motivo: comentarios.clima_motivo || 'Sin respuesta válida de la API.' }];
todos = todos.map(x => Object.fromEntries(Object.entries(x).filter(([, v]) => v !== null && v !== undefined)));
const previos = todos.filter(x => x.fecha < hoy);
const dias = todos.filter(x => x.fecha >= hoy).slice(0, config.clima.dias_pronostico);
let cambio = comentarios.clima_cambio_brusco ?? null;
if (cambio === null && previos.length && dias.length) {
  const promPrev = previos.reduce((s, x) => s + x.max, 0) / previos.length;
  const maxProx = Math.max(...dias.map(x => x.max)), minProx = Math.min(...dias.map(x => x.max));
  if (maxProx - promPrev >= config.clima.cambio_brusco_grados) cambio = `la máxima sube hasta ${Math.round(maxProx)}° frente a un promedio de ${Math.round(promPrev)}° en los días previos.`;
  else if (promPrev - minProx >= config.clima.cambio_brusco_grados) cambio = `la máxima baja hasta ${Math.round(minProx)}° frente a un promedio de ${Math.round(promPrev)}° en los días previos.`;
}
const clima = { lugar: config.clima.lugar, corte: consultado, fuente: fuenteClima, dias, previos, cambio_brusco: cambio, alertas: comentarios.clima_alertas || null, no_disponible: ndClima };

escribirJson(path.join(dir, 'finanzas.json'), finanzas);
escribirJson(path.join(dir, 'clima.json'), clima);
console.log(JSON.stringify({ dolar, anterior, dias: dias.map(d => `${d.fecha} ${d.max}/${d.min}`), previos: previos.length, cambio, no_disponible: noDisponible.length }, null, 2));
