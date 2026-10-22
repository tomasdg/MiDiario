# Historial de decisiones

Registro cronológico de decisiones editoriales y técnicas, comentarios del lector y fe de erratas. Cada entrada lleva fecha. Los errores de contenido se repiten en la sección "Fe de erratas" de la edición siguiente.

Origen: este repositorio es un fork de El Diario de Yrigoyen. Se conservan las reglas editoriales, la maquetación y el preflight; cambian el lector, los temas, la periodicidad y la entrega.

## Adaptación inicial — 20 de octubre de 2026

- Nombre: **El Diario Semanal de Tom**. Lugar: Villa Urquiza, Buenos Aires.
- Periodicidad diaria, cierre 07:00 hora argentina, todos los días.
- Cuatro páginas A4: portada; inteligencia artificial; tecnología y empresas; impresión 3D con dólar oficial, clima, glosario y fuentes.
- Se eliminan Boca, criptomonedas, Córdoba, educación, ciencia, disco, microrelato y poesía.
- Se lee por mail: el PDF se sube a OneDrive y se envía un mail con titulares, dólar y link. El PDF se mantiene apto para imprimir.
- Corre en la nube como tarea programada de Claude, sin PC encendida. El registro anti-repetición de cada edición se guarda en OneDrive.

## Pedidos del lector — 20 de octubre de 2026

- El diario pasa a llamarse **El Diario Semanal de Tom**.
- Se agrega la sección **Claude Tips**: un tip novedoso de la comunidad por día, en un recuadro al pie de la página de IA.

## Corrección de maquetación — 20 de octubre de 2026

- El lector vio en su pantalla la agenda de portada superpuesta con las llamadas. Causa: la página web usaba las fuentes de su computadora, más anchas que las del armado, y el preflight no comparaba las llamadas de portada.
- Se incrustan las fuentes (Lora e Inter) en el HTML, el PDF y la página web, así el control y la pantalla del lector usan la misma tipografía.
- El preflight ahora revisa llamadas, agenda y la nota principal de portada, y el cuerpo de la principal entra en el ajuste automático.

## Datos no disponibles — 21 de octubre de 2026

- En la corrida programada de la edición Nº 2, WebFetch no pudo leer DolarApi ni MET Norway (dos intentos cada una). Se publicó "dato no disponible" para dólar y clima, sin inferir valores.
- `datos.js`, `render.js` y el esquema ahora aceptan una edición sin pronóstico (clima con `dias` vacío y su propio `no_disponible`), en lugar de cortar el armado.

## Pedidos del lector — 21 de octubre de 2026

- El diario pasa a llamarse **De Villa Urquiza al Mundo** (antes "El Diario Semanal de Tom"), porque sale todos los días. El PDF cambia de nombre desde la edición Nº 2; los registros anteriores no se tocan.
- Dólar: como el diario cierra antes de que abra el mercado (10:00), se publica siempre la cotización de cierre del último día hábil, aclarado en la tabla. No es un dato faltante.
- Clima: no se acepta "no disponible" sin agotar la cadena de respaldo del procedimiento (MET Norway con dos URLs, control de `updated_at` por cachés viejas y, si hace falta, el pronóstico del SMN u otro servicio reconocido).
- La edición Nº 2 se rearmó con el nuevo nombre, el dólar de cierre del martes 20 ($ 1.495 / $ 1.545) y el pronóstico de MET Norway de las 08:23.

## Resumen semanal para NotebookLM y YouTube — 21 de octubre de 2026

- Pedido del lector: con las ediciones de la semana, armar material para que NotebookLM haga un podcast o video y subir un video por semana a YouTube.
- NotebookLM no tiene conector ni API pública: Claude arma la fuente y las instrucciones de personalización; el lector genera el video y lo sube a mano. El guion lo hace NotebookLM.
- Tarea programada aparte, los domingos (`pipeline/SEMANAL.md`), con página propia de link fijo.

## Datos de respaldo — 22 de octubre de 2026

- Edición Nº 3: WebFetch no pudo leer DolarApi, las dos URLs de MET Norway ni el SMN (el permiso para esas URLs no se concedió a tiempo en la corrida programada). Se siguió la cadena de respaldo: dólar de cierre del miércoles 21 según Ámbito ($ 1.495 / $ 1.545) y pronóstico de Meteored.
- `datos.js` acepta `dolar_fuente` en `comentarios.json` y la página de cierre muestra esa fuente en lugar de "DolarApi" fijo.

## Fe de erratas pendiente

(ninguna)
