# Pipeline de Mi Diario Semanal

Node + Playwright (Chromium). En la nube de Claude no hace falta instalar nada: `src/deps.js` usa el Playwright y el Chromium preinstalados. En otra máquina, `npm install` en esta carpeta.

| Comando | Qué hace |
|---|---|
| `node src/datos.js ../ediciones/AAAA-MM-DD AAAA-MM-DD` | Arma `datos/finanzas.json` (dólar oficial) y `datos/clima.json` desde los datos crudos. |
| `node src/build.js ../ediciones/AAAA-MM-DD --html` | Valida el esquema, verifica fuentes y anti-repetición, renderiza, ajusta el cuerpo tipográfico por página, corre el preflight y escribe HTML, PNG y `preflight.json`. No genera PDF: sirve para iterar. |
| `node src/build.js ../ediciones/AAAA-MM-DD` | Lo mismo y, si todo está en verde, genera el PDF y el registro en `historial/ediciones/`. |
| `node src/web.js ../ediciones/AAAA-MM-DD` | Genera `web/index.html`, la versión para publicar como página de Claude, con link al PDF en GitHub. |

Archivos:

- `src/render.js`: JSON → HTML paginado (portada, páginas de flujo en tres columnas y página de cierre con impresión 3D, dólar, clima, glosario y fuentes).
- `src/icons.js` y `assets/icons/`: iconos meteorológicos por código WMO (el símbolo de MET Norway se traduce en `datos.js`).
- `src/preflight.js`: geometría (desbordes, intersecciones, encabezados y pies) y densidad sobre el PNG de cada página.
- `src/verificar.js`: esquema JSON (validador propio), fuentes, frescura y anti-repetición.
- `templates/diario.css`: estilos de impresión.
- `PROCEDIMIENTO.md` y `prompts/`: instrucciones para armar una edición completa y los briefs de cada sección.
