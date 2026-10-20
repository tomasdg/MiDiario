# Mi Diario Semanal

Documento maestro editorial y técnico de un diario personal generado con IA. Basado en El Diario de Yrigoyen: se conservan sus reglas de selección, verificación, maquetación y preflight; cambian el lector, los temas, la periodicidad y la entrega.

Este documento contiene las reglas. Lo que cambia vive aparte:

| Qué | Dónde |
|---|---|
| Perfil del lector y temas | [perfil/lector.md](perfil/lector.md) |
| Parámetros de edición (cierre, páginas, mapa de páginas, clima, dólar, entrega) | [config/edicion.json](config/edicion.json) |
| Fuentes de datos y medios aceptados | [config/fuentes.json](config/fuentes.json) |
| Esquema del contenido | [esquema/contenido.schema.json](esquema/contenido.schema.json) |
| Decisiones y fe de erratas | [historial/DECISIONES.md](historial/DECISIONES.md) |
| Registro por edición (anti-repetición) | `historial/ediciones/AAAA-MM-DD.json` |
| Procedimiento de armado diario | [pipeline/PROCEDIMIENTO.md](pipeline/PROCEDIMIENTO.md) |
| Ediciones (JSON, HTML, PDF, PNG, acta) | `ediciones/AAAA-MM-DD/` |

## 1. Identidad

- Nombre: **Mi Diario Semanal**. Lugar: Villa Urquiza, Buenos Aires.
- Periodicidad: **diaria**, con cierre a las 07:00 hora argentina. Numeración correlativa.
- Objetivo: una edición cerrada, seleccionada y agradable de leer, con aspecto de diario impreso. No replicar el flujo infinito de un portal.
- Formato: A4, blanco y negro, cuatro páginas. Se lee en pantalla (página de Claude, link fijo) y se imprime desde el PDF.
- Uso personal.

## 2. Páginas

1. **Portada**: nombre, número, fecha y lugar; franja con clima de hoy y mañana, dólar oficial y cifra del día; nota principal con bajada; seis o siete secundarias con remisión a página; agenda con fechas próximas; cuatro llamadas al pie.
2. **Inteligencia artificial**: modelos, herramientas, agentes, anuncios de laboratorios, regulación, seguridad.
3. **Tecnología y empresas**: productos, software, hardware, infraestructura; resultados, compras, rondas de inversión, despidos, cambios de liderazgo, juicios.
4. **Impresión 3D y cierre**: notas de impresión 3D en dos columnas; columna derecha con dólar oficial (compra, venta, variación contra la edición anterior), clima de cuatro días, glosario, fe de erratas y fuentes.

## 3. Principios editoriales

1. Selección, jerarquía y contexto antes que cantidad.
2. No rellenar con contenido débil, genérico o evidente.
3. No inventar datos, precios, fechas, resultados ni fuentes.
4. Distinguir hecho, análisis y opinión (campo `tipo` de cada nota).
5. Cada nota responde qué pasó, quién, cuándo y qué dato o documento lo prueba.
6. Ventana de hechos: últimas 48 horas para IA, tecnología y empresas. Impresión 3D tiene menos volumen diario y admite hasta siete días, priorizando lo más reciente.
7. Separar el anuncio comercial de la mejora comprobable: cifras, benchmarks, precio, disponibilidad. Si la fuente no publica un dato, decirlo. Los benchmarks propios de una empresa se presentan como tales.
8. Si una novedad cambia algo para quien vive en Argentina (precio, disponibilidad, regulación), decirlo.
9. No repetir notas de ediciones anteriores salvo que haya un hecho nuevo; el registro por edición lo controla.
10. Si un dato no se consiguió al cierre, se usa el componente "dato no disponible" con la hora del intento. Nunca se completa por inferencia.
11. Contenido patrocinado: se puede usar como fuente de un dato, pero se marca como tal en el nombre del medio.

## 4. Presupuesto de redacción

- Página de flujo en tres columnas (A4, 8,5 a 9,25 pt): unas 1.250 palabras en total, títulos y bajadas incluidos. Nota de apertura 220 a 260 palabras; secundarias 90 a 160; breves 30 a 60. Nunca más de nueve notas por página.
- Página 4: las notas ocupan dos columnas, unas 850 palabras.
- Portada: principal de 350 a 420 palabras en cuatro párrafos; secundarias con resumen de 20 a 30 palabras; agenda de cinco a siete fechas.
- Lo que no entra se descarta siguiendo `orden_recorte` de la configuración. Si sobra aire, se agrega un breve ya investigado, nunca relleno.

## 5. Datos y fuentes

- Dólar oficial y clima siempre desde las APIs de `config/fuentes.json`, nunca de memoria.
- Noticias de fuentes primarias (blogs oficiales, comunicados, presentaciones ante la SEC, repositorios, papers) o de los medios aceptados. Siempre abrir la fuente antes de dar un dato por válido; un resultado de búsqueda no alcanza.
- Cada nota guarda URL, medio, título, fecha de publicación y hora de consulta.

## 6. Maquetación y preflight

Se mantiene el sistema de El Diario de Yrigoyen: contenido en JSON validado contra el esquema, plantilla HTML/CSS con páginas de tamaño fijo y columnas, Chromium para medir y generar el PDF, ajuste automático de cuerpo tipográfico por página y preflight obligatorio.

**Es inadmisible entregar un PDF con texto superpuesto, cortado, fuera de página o ilegible.** El preflight (`pipeline/src/preflight.js`) falla ante desbordes, intersecciones o páginas sin encabezado y pie, y mide la densidad sobre el PNG de cada página (ocupación mínima 78%, mayor hueco 18% del área útil). Después, el modelo mira los PNG con esta rúbrica: sin superposiciones; sin texto cortado; títulos pegados a su texto; tablas alineadas; iconos visibles; sin huecos blancos no intencionales; pie y número de página presentes.

El pipeline no necesita instalar nada en la nube: usa el Playwright y el Chromium preinstalados (`pipeline/src/deps.js`) y valida el esquema con código propio.

## 7. Memoria entre ediciones

- Cada edición escribe `historial/ediciones/AAAA-MM-DD.json` con temas, URLs usadas, glosario y dólar oficial.
- El preflight falla si se repite un título o un término de glosario de los últimos 14 días, y avisa si se reutiliza una URL.
- El dólar de la edición anterior se usa para la variación diaria.
- Los comentarios del lector se anotan en `historial/DECISIONES.md` con fecha; los errores de contenido pasan a la fe de erratas de la edición siguiente.

## 8. Guía de estilo

- Fechas: "martes 20 de octubre de 2026"; en tablas, "20/10/2026" o "20 oct".
- Horas: 24 horas, "19:30"; "hora argentina" la primera vez.
- Números: coma decimal y punto de miles ("1.540,00", "7,8%").
- Monedas: "US$ 5.660 millones"; "$ 1.540" para pesos.
- Titulares en minúscula inicial, sin punto final. Bajadas de una oración.
- Siglas: se desarrollan la primera vez salvo las universales (IA, API, GPU, PDF).
- Fuente al pie de cada nota: "Fuente: Medio, fecha".
- Español rioplatense, sobrio, sin exclamaciones ni emojis. Resumir con palabras propias: no copiar párrafos de las fuentes.

## 9. Edición terminada

Una edición está terminada cuando `ediciones/AAAA-MM-DD/preflight.json` dice `ok: true`, la revisión visual está registrada como aprobada, el PDF y el registro están en el repositorio y la página de Claude muestra la edición del día.
