# Procedimiento de armado de una edición

Instrucciones para el modelo que arma la edición diaria. Las ejecuta la tarea programada de Claude "De Villa Urquiza al Mundo" todos los días a las 07:00 hora argentina, en la nube y sin nadie mirando: no se piden confirmaciones. También se pueden seguir a mano.

## 0. Preparar

1. Obtener la fecha y hora actuales con la herramienta de hora (zona America/Argentina/Buenos_Aires). FECHA = AAAA-MM-DD de hoy. Cierre = hora de inicio, con offset -03:00.
2. Clonar el repositorio (si no está en la sesión): `git clone --depth 30 https://github.com/tomasdg/midiario` y trabajar en su raíz.
3. Leer: `DE_VILLA_URQUIZA_AL_MUNDO.md`, `perfil/lector.md`, `config/edicion.json`, `config/fuentes.json`, `historial/DECISIONES.md` y los registros de los últimos días en `historial/ediciones/` (los títulos y URLs ya publicados no se repiten).
4. Número de edición = número del último registro + 1 (si no hay registros, 1).
5. `mkdir -p ediciones/$FECHA/datos ediciones/$FECHA/investigacion`

## 1. Datos estructurados

La terminal no tiene salida a esas APIs: se leen con WebFetch. **Dólar y clima nunca salen como "no disponible" sin haber agotado la cadena de respaldo de abajo** (decisión del lector, 21/10/2026).

**Dólar oficial.** El diario cierra antes de que abra el mercado de cambios (10:00), así que la cotización que corresponde es **la de cierre del último día hábil**. Eso es lo que devuelve DolarApi a esa hora; es lo esperado, no un dato viejo.

1. WebFetch a `https://dolarapi.com/v1/dolares/oficial` pidiendo el JSON crudo. Guardarlo en `ediciones/$FECHA/datos/dolar_oficial.json`.
2. Si falla, reintentar una vez. Si sigue fallando: buscar con WebSearch "dólar oficial Banco Nación cierre <fecha del día hábil anterior>", abrir un resultado de un medio aceptado o del BNA y armar el mismo JSON (`compra`, `venta`, `fechaActualizacion` = cierre de ese día, 15:00 hora argentina) con el medio en `comentarios.json` → `finanzas`.
3. En `datos/comentarios.json` poner siempre `"finanzas": "Cotización de cierre del <día> <fecha>: el mercado de cambios abre a las 10, después del cierre de esta edición."`

**Clima.** Pedir siempre el resumen por día en hora argentina para hoy y los tres días siguientes, con esta forma exacta, y guardarlo en `ediciones/$FECHA/datos/clima_metno.json`:
`{"updated_at": "<meta.updated_at>", "dias": [{"fecha": "AAAA-MM-DD", "max_c": n, "min_c": n, "precip_mm": n, "viento_max_kmh": n, "symbol_code": "<símbolo de las 15:00>"}]}`

1. WebFetch a `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=-34.573&lon=-58.488`.
2. **Controlar `updated_at`**: si tiene más de 6 horas, la respuesta vino de una caché. Repetir con `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=-34.57&lon=-58.49` (otra URL, otra caché) y quedarse con la más reciente.
3. Si MET Norway no responde o ambas son viejas: WebSearch "pronóstico extendido Villa Urquiza" o "pronóstico Buenos Aires SMN", abrir el pronóstico del SMN o de otro servicio meteorológico reconocido y completar el mismo JSON (`updated_at` = hora de consulta; `symbol_code` con el código de MET Norway más parecido: clearsky_day, fair_day, partlycloudy_day, cloudy, lightrain, rain, heavyrain, rainshowers_day, thunder). Anotar el servicio en `comentarios.json` → `clima_fuente`.
4. Sólo si todo eso falla, registrar el faltante en `no_disponible` y decirlo en el resumen final.

Después, correr `node pipeline/src/datos.js ediciones/$FECHA $FECHA`.

## 2. Investigación

Investigar directamente (sin subagentes), sección por sección, siguiendo `pipeline/prompts/comun.md` y el brief de cada sección:

- `pipeline/prompts/ia.md` → página 2
- `pipeline/prompts/tecnologia_empresas.md` → página 3
- `pipeline/prompts/impresion3d.md` → página 4
- `pipeline/prompts/claude_tips.md` → recuadro Claude Tips al pie de la página 2

Usar WebSearch (modo "extended" si el estándar trae poco) y abrir siempre la fuente con WebFetch. Si un sitio está bloqueado, buscar otra fuente del mismo hecho; si no hay, descartar la nota. Guardar lo encontrado en `ediciones/$FECHA/investigacion/<seccion>.json` (opcional pero recomendado).

Elegir la **nota principal** de portada entre las de mayor importancia de cualquier sección, con preferencia por IA.

## 3. Redacción

Escribir `ediciones/$FECHA/contenido.json` según `esquema/contenido.schema.json`:

- `edicion`: número, fecha, cierre, lugar "Villa Urquiza, Buenos Aires", papel "A4".
- `finanzas`: `"@datos/finanzas.json"`; `clima`: `"@datos/clima.json"`.
- `portada.principal`: 350 a 420 palabras en cuatro párrafos; `secundarias`: 7, con resumen de 20 a 30 palabras y `pagina`; `agenda`: 5 a 7 fechas próximas tomadas de las notas (lanzamientos, presentaciones de resultados, eventos); `llamadas`: 4, una por página interior más una de "Hoy"; `dato_del_dia`: una cifra de la edición con su explicación.
- `notas`: con `seccion` en `ia`, `tecnologia`, `empresas` o `impresion3d`. Breves con `seccion: "breve"` y `seccion_destino`. Presupuestos en `DE_VILLA_URQUIZA_AL_MUNDO.md` §4. Cada nota con `id` único, `fuentes` con `consultado` en ISO -03:00, `sensible_al_tiempo` en `true` salvo notas de impresión 3D de más de dos días.
- `claude_tip`: el tip del día según `pipeline/prompts/claude_tips.md` (título, `donde`, `origen`, dos párrafos en `texto`, dos a cuatro `pasos`, `fuentes`). Ocupa unas 180 palabras de la página 2: descontarlas del presupuesto de esa página. En la portada, una de las cuatro llamadas es "Claude Tips".
- `glosario`: 3 o 4 términos que aparezcan en las notas, sin repetir los de los últimos 14 días.
- `fe_de_erratas`: lo pendiente en `historial/DECISIONES.md`, o `[]`.

Escribir con palabras propias; nunca copiar párrafos de las fuentes.

## 4. Maquetación y preflight

```
cd pipeline
node src/build.js ../ediciones/$FECHA --html   # iterar hasta geoOk y densidadOk en true
node src/build.js ../ediciones/$FECHA          # PDF, PNG, preflight.json y registro en historial/ediciones/
```

- `desborde_columna` u `overflow` en una página: recortar en esa página (una columna A4 equivale a unas 420 palabras).
- `overflow_vertical` en `principal` o `interseccion` con llamadas en la portada: acortar la principal o la agenda.
- Densidad baja: agregar una secundaria o un breve ya investigado, o alargar la principal si es la portada. Nunca relleno.

## 5. Revisión visual

Mirar los cuatro PNG de `ediciones/$FECHA/paginas/` con la rúbrica de `DE_VILLA_URQUIZA_AL_MUNDO.md` §6. Corregir, reconstruir y volver a mirar. Registrar el resultado en `preflight.json` (`pasos.revision_visual`: estado `aprobada`, hallazgos y correcciones).

## 6. Guardar en GitHub

```
git add ediciones/$FECHA historial/
git commit -m "Edición Nº <n> del $FECHA"
git push origin main
```

Si el push falla, reintentar una vez después de `git pull --rebase origin main`. Si sigue fallando, seguir igual: la página se publica sin link al PDF y se avisa en el resumen.

## 7. Publicar la página

```
node pipeline/src/web.js ediciones/$FECHA
```

Publicar `ediciones/$FECHA/web/index.html` con la herramienta Artifact, usando `url` = `entrega.artifact_url` de `config/edicion.json` para actualizar siempre la misma página (si la herramienta pide leerla antes, leerla con `action: "read"` y publicar igual el archivo nuevo, que reemplaza la edición anterior). Descripción: "Edición Nº <n> del <fecha larga>".

## 8. Resumen final (es el mail que recibe el lector)

Terminar con un mensaje breve, en español, que llega por mail como aviso de la tarea:

```
De Villa Urquiza al Mundo Nº <n> — <día> <fecha>

<título de la nota principal>
• <secundaria 1>
• <secundaria 2>
• <secundaria 3>
• <secundaria 4>

Dólar oficial (cierre del <día hábil anterior>): $ <compra> / $ <venta> (<variación>)
Clima: <máx>° / <mín>°, <estado>

Claude Tip: <título del tip>

Leer la edición: <artifact_url>
PDF para imprimir: <link al PDF en GitHub>
```

Si algo quedó sin verificar o falló (dato no disponible, push, publicación), agregar una línea al final que lo diga.
