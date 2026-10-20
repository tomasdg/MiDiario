# Sección: CLAUDE TIPS (recuadro al pie de la página 2)

Aplicá `comun.md`, con ventana de hasta 14 días. Escribí el resultado en `ediciones/{FECHA}/investigacion/claude_tips.json` con la forma {"tema": "claude_tips", "consultado_el": ISO, "candidatos": [...], "elegido": {...}}.

Buscá en la comunidad un tip **novedoso y práctico** para usar Claude que el lector pueda probar hoy:

- Dónde buscar: r/ClaudeAI y r/ClaudeCode (si Reddit está bloqueado, buscá el mismo post citado por un medio o blog), Hacker News, blogs y newsletters de desarrolladores (Simon Willison, Latent Space, AI Coding Daily y similares), repositorios con colecciones de tips, el blog y las notas de versión de Anthropic, posts de desarrolladores conocidos.
- Sirven: atajos y comandos de Claude Code, flujos de trabajo con proyectos, artifacts, skills, conectores, MCP, memoria, investigación, uso en el celular, formas de pedir que den mejores resultados, usos creativos que alguien probó y documentó.
- No sirven: consejos genéricos ("sé claro en tu pedido"), trucos para saltear reglas o límites, tips repetidos de los últimos 30 días (ver `historial/ediciones/`).
- Si el tip depende de una función concreta, verificá en docs.claude.com o support.claude.com que exista y funcione así. Si no se puede verificar, descartalo.

Entregá 2 o 3 candidatos y elegí uno con esta forma (es la que va a `claude_tip` en contenido.json):
{"titulo": "en imperativo, corto", "donde": "Claude Code | claude.ai | app de escritorio | API", "origen": "Visto en <comunidad>", "texto": ["de dónde salió, con fecha", "por qué sirve"], "pasos": ["2 a 4 pasos concretos, con el pedido o comando exacto entre comillas"], "fuentes": [{"url": "", "medio": "", "titulo": "", "fecha_publicacion": "AAAA-MM-DD", "consultado": "ISO"}]}

Unas 150 a 180 palabras en total. Si el tip implica tocar archivos o el sistema, incluí la precaución que corresponda.
