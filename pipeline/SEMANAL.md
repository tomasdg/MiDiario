# Procedimiento del resumen semanal (NotebookLM y YouTube)

Lo ejecuta la tarea programada "De Villa Urquiza al Mundo · Semanal" los domingos a la mañana, en la nube y sin nadie mirando. No se piden confirmaciones. Arma el material para que Tom haga en NotebookLM un video o podcast de la semana y lo suba a YouTube.

NotebookLM no tiene conector ni API pública: esa parte la hace Tom a mano (unos 10 minutos). Este procedimiento le deja todo listo para copiar y pegar.

## 1. Preparar

1. Fecha de hoy con la herramienta de hora (America/Argentina/Buenos_Aires). FECHA = AAAA-MM-DD.
2. Clonar o actualizar el repositorio (`git clone --depth 30 https://github.com/tomasdg/midiario`, o `git pull origin main`).
3. Si la edición diaria de hoy todavía no está en `ediciones/$FECHA`, seguir igual con las que haya (el resumen toma los últimos 7 días).
4. Leer las ediciones de la semana: `ediciones/*/contenido.json` de FECHA y los 6 días anteriores. Mirar también `semanal/` de la semana pasada para no repetir el enfoque ni el título.

## 2. Escribir `semanal/$FECHA/editorial.json`

```json
{
  "titulo_semana": "una oración que resuma la semana",
  "claves": [{ "titulo": "3 a 5 palabras", "texto": "una o dos oraciones con el dato concreto" }],
  "enfoque_notebooklm": "instrucciones para personalizar el resumen en NotebookLM",
  "youtube": { "titulo": "", "descripcion": "", "etiquetas": [], "miniatura": "" },
  "excluir": [],
  "secciones": {}
}
```

- **claves**: las 5 historias más importantes de la semana, de todas las secciones, con su cifra principal. Sólo datos que estén en las ediciones.
- **enfoque_notebooklm**: partir del de la semana anterior y ajustarlo a esta. Siempre: español rioplatense, público argentino interesado en tecnología, 10 a 15 minutos, abrir con las claves, profundizar en 2 o 3 historias con lo que le importa a alguien en Argentina, un momento de impresión 3D, cerrar con los Claude Tips, citar fuentes, aclarar cuando una cifra es de la propia empresa, no inventar.
- **youtube.titulo**: hasta 90 caracteres, con las dos o tres historias más fuertes y nombres propios que la gente busca. Terminar con "| Semana tech". Sin mayúsculas sostenidas ni signos de exclamación; nada que prometa más de lo que el video cuenta.
- **youtube.descripcion**: dos oraciones que digan qué semana cubre y para quién es. El script agrega la lista de temas, las fuentes y la aclaración de que se hizo con IA.
- **youtube.etiquetas**: 10 a 15, en español, mezclando temas generales y nombres propios de la semana.
- **excluir** (opcional): lista de `id` de notas a dejar afuera de la fuente: breves de agenda que ya quedaron superados por la nota con el resultado («X presenta hoy») o anticipos de algo que la semana después contó completo.
- **secciones** (opcional): `{ "id": "seccion" }` para corregir la sección de una nota, sobre todo de las principales, cuya sección se adivina por palabras (p. ej. una falla de seguridad que cae en IA y va en `tecnologia`).
- **youtube.miniatura**: 3 a 6 palabras en mayúsculas, la idea más fuerte.

## 3. Generar y revisar

```
node pipeline/src/semanal.js $FECHA
```

Leer `semanal/$FECHA/fuente-notebooklm.md` completo: que no falten las principales de cada día, que no haya notas repetidas y que las claves coincidan con lo que dicen las notas.

## 4. Guardar y publicar

```
git add semanal/$FECHA pipeline
git commit -m "Resumen semanal del $FECHA"
git push origin main
```

Publicar `semanal/$FECHA/web/index.html` con la herramienta Artifact usando `url` = `entrega.artifact_semanal_url` de `config/edicion.json`, para reemplazar siempre la misma página. Descripción: "Resumen de la semana del <rango>".

## 5. Resumen final (llega por mail y al celular)

```
Resumen semanal listo — semana del <rango>

<titulo_semana>

Título para YouTube: <titulo>

Abrí la página, copiá la fuente en NotebookLM y seguí los 5 pasos: <artifact_semanal_url>
```
