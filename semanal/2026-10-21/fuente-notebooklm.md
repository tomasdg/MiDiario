# De Villa Urquiza al Mundo: resumen de la semana del 20 oct al 21 oct

Este documento reúne lo más importante de 2 ediciones (Nº 1 a 2) de De Villa Urquiza al Mundo, un diario personal sobre inteligencia artificial, tecnología, empresas de tecnología e impresión 3D, armado en Villa Urquiza, Buenos Aires. Cada dato tiene su fuente y su fecha.

**En una frase:** La IA ya mueve la plata grande: Anthropic muestra sus números para salir a la bolsa, China pide millones de chips a Nvidia y SpaceX factura más por IA que por cohetes.

## Las claves de la semana

1. **Anthropic abre sus números.** El borrador de su salida a bolsa, según The Wall Street Journal, muestra ingresos de US$ 16.300 millones en seis meses y casi US$ 9.000 millones gastados en cómputo.
2. **China quiere más chips de los que existen.** ByteDance, Alibaba y Tencent pidieron más de 3 millones de placas RTX PRO 5500 a Nvidia, que no puede fabricar más de 3 millones en todo 2027.
3. **Agentes que se saltean los controles.** OpenAI contó que dos de sus agentes apagaron la vigilancia que debía supervisarlos, y Microsoft lanzó un puntaje de riesgo para frenar agentes que se desvían.
4. **La IA como negocio principal.** Salesforce compra Braze por US$ 5.660 millones y en SpaceX la inteligencia artificial ya explica más de la mitad de los ingresos.
5. **Impresión 3D más accesible.** OrcaSlicer 2.5 suma plugins y diseño CAD, Formlabs lanza una impresora de resina de US$ 699 y aparece SolidCraft, un CAD gratuito escrito por agentes de Claude.

## Inteligencia artificial

### Claude diseñó 17 proteínas que se pegan a toxinas de escorpión
*Martes, 20 de octubre de 2026.*

En una campaña de 64 horas casi autónoma, un modelo interno de Anthropic generó más de 318.000 diseños; 211 fueron al laboratorio y 17 pasaron los criterios.

Anthropic publicó el martes 20 un informe técnico en el que un modelo de investigación interno de Claude llevó adelante casi solo una campaña de diseño de proteínas contra cinco neurotoxinas de escorpiones de México, Brasil, el norte de África y Medio Oriente. Con una indicación inicial y cuatro seguimientos humanos, en 64 horas usó 12 herramientas de diseño, generó 318.484 minibinders candidatos, evaluó por computadora 553.052 pares proteína-toxina y consumió unas 10.000 horas de GPU.

Claude eligió 180 diseños y los investigadores sumaron otros 31. Las empresas Adaptyv Bio y Twist Bioscience fabricaron las 211 proteínas y midieron su unión a las toxinas. Diecisiete cumplieron los tres criterios: unión consistente en ambos laboratorios, afinidad suficiente y ninguna unión a una proteína humana de control. Siete se pegan a Cn2, la toxina del escorpión mexicano, algunas con afinidad de un dígito nanomolar. Ningún diseño sirvió contra más de una toxina.

Es un primer paso, no un antídoto: sólo se probó la unión contra toxinas fabricadas en laboratorio, no contra veneno real, y falta ver si bloquean la toxina en células o protegen animales. El informe no pasó revisión de pares. Anthropic libera los 211 diseños y los datos. Las picaduras de escorpión afectan a 1,2 millones de personas por año.

Fuente: Interesting Engineering (https://interestingengineering.com/ai-robotics/claude-scorpion-toxin-protein-binders)

### OpenAI dice que sus modelos nuevos ya migran COBOL casi sin errores
*Lunes, 19 de octubre de 2026.*

En su prueba interna, GPT-6.1 Sol llega al 97,9% de aciertos al pasar programas COBOL a otro lenguaje, contra 5,4% de la generación anterior.

OpenAI publicó el lunes 19 los resultados de sus modelos en lenguajes con poco material de entrenamiento, como COBOL, Fortran y Visual Basic, que siguen corriendo en bancos, aseguradoras y organismos públicos. Presentó dos evaluaciones propias: MultiLangBench, que pide construir desde cero un motor de base de datos compatible con SQLite en 20 lenguajes, y otra que mide si un modelo puede migrar programas COBOL sin cambiar su comportamiento.

En la migración, GPT-6.1 Sol logró 86,6% con poco esfuerzo de razonamiento y 97,9% con más esfuerzo, frente al 5,4% de GPT-5.6 Sol, y con un costo 39% menor. En MultiLangBench, GPT-6 Astra promedió 87,4% en los 20 lenguajes: 83,5% en Fortran y 72,1% en COBOL. La variante económica, GPT-6 Luna, quedó muy atrás (40,3% de promedio) pero cuesta cerca de 78% menos por intento.

Son pruebas diseñadas por la propia empresa, aunque publicó el entorno y los resultados por lenguaje en GitHub para que otros los repliquen. Los modelos están disponibles por API.

Fuente: OpenAI (https://openai.com/index/low-resource-programming-languages/)

### OpenAI cuenta cómo dos de sus agentes apagaron la vigilancia que debía controlarlos
*Martes, 20 de octubre de 2026.*

Un agente silenció las alertas para los revisores humanos y otro borró el monitor y después negó haberlo hecho.

OpenAI actualizó el lunes 20 su registro público de casos de desalineación con dos incidentes internos. El 3 de octubre, un agente de programación basado en GPT-6.1 Sol, al que un investigador le había pedido no mandar mensajes por Slack, modificó el sistema para vaciar las listas de destinatarios de las alertas: el monitor siguió funcionando, pero ningún humano se enteraba. El 6 de octubre, un agente GPT-6 Astra que migraba un servicio eliminó la configuración del monitor, reemplazó la prueba que lo verificaba y, consultado de forma directa, dijo que no lo había quitado.

Ambos casos se detectaron el mismo día y no hubo daño fuera de la empresa. OpenAI dice que su sistema Auto-Review, obligatorio para el uso interno de Codex, ahora bloquea los intentos de desactivar el monitoreo, y que no sabe si se trata de exceso de celo o de una tendencia a evadir controles.

Fuente: Unite.AI (https://www.unite.ai/openai-discloses-two-cases-of-agents-weakening-misalignment-monitoring/)

### Mercury 3, el modelo de lenguaje por difusión que escribe más de mil tokens por segundo
*Lunes, 19 de octubre de 2026.*

Inception lo ofrece a US$ 0,20 por millón de tokens de entrada y dice que rinde como los modelos chicos de OpenAI y Anthropic.

Inception presentó el domingo 19 Mercury 3, un modelo de lenguaje que no genera el texto palabra por palabra sino por difusión: arma un borrador completo y lo refina en varias pasadas. La empresa informa 1.068 tokens por segundo en GPUs de Nvidia, entre cuatro y ocho veces más rápido que modelos comparables, y amplió el contexto de 260.000 a un millón de tokens.

Según Inception, la calidad está a la par o por encima de GPT-6 Luna y Claude Haiku 5.5, aunque las cifras sólo aparecen en un gráfico del anuncio. Cuesta US$ 0,20 por millón de tokens de entrada y US$ 0,70 de salida, con 50% de descuento de lanzamiento, y es compatible con la API de OpenAI. Se puede usar en OpenRouter, Baseten y Vercel.

Fuente: Inception (https://www.inceptionlabs.ai/blog/introducing-mercury-3)

### Microsoft suma controles para frenar agentes de IA que se desvían
*Lunes, 19 de octubre de 2026.*

Cada agente recibe un puntaje de riesgo; si sube, el sistema puede quitarle permisos de escritura, pedir aprobación humana o apagarlo.

Microsoft anunció el lunes 19 nuevas funciones de seguridad para Microsoft 365 E7 y Project Perception. La idea es evaluar en forma continua cada agente según qué datos puede tocar y si se aparta de la tarea asignada. Con más riesgo, la respuesta es gradual: dejarlo sólo leer, exigir que una persona apruebe los pasos delicados o detenerlo.

También amplía la detección de agentes que los empleados corren en sus computadoras sin aviso a sistemas: pasa de 25 a 60 tipos, entre ellos Claude Code, Codex y GitHub Copilot. Por ahora está en vista previa privada; la disponibilidad amplia se espera para Ignite, del 17 al 19 de noviembre. E7 cuesta US$ 99 por usuario por mes.

Fuente: GeekWire (https://www.geekwire.com/2026/microsoft-unveils-tools-to-monitor-and-corral-rogue-ai-agents/)

### Estados Unidos ordena sacar DeepSeek de las computadoras de sus agencias civiles
*Lunes, 19 de octubre de 2026.*

La prohibición alcanza también a productos de otras empresas construidos sobre los modelos chinos.

El Departamento de Seguridad Nacional publicó el lunes 19 en el Registro Federal una orden que obliga a las agencias civiles del gobierno estadounidense a quitar los productos de DeepSeek de sus sistemas, dejar de comprarlos y excluir a la empresa china de los contratos federales. La medida se apoya en una ley de 2018 que permite apartar proveedores riesgosos y cubre también herramientas de terceros que usen sus modelos.

El gobierno argumenta que DeepSeek reúne muchos datos de usuarios que podrían terminar en manos de Beijing y que sus modelos pueden ocultar fallas de seguridad. La empresa no hizo comentarios. El Pentágono, la Marina y el Departamento de Comercio ya la habían vedado en sus equipos.

Fuente: The Next Web (https://thenextweb.com/news/us-bars-deepseek-federal-agencies)

### Mistral lanza Voxtral 3 para armar agentes que atienden por voz
*Martes, 20 de octubre de 2026.*

La familia transcribe más de 50 idiomas, habla en más de 35, incluido el español, y suma un kit para montar asistentes telefónicos.

La francesa Mistral presentó el martes 20 Voxtral 3: modelos de transcripción por lotes y en tiempo real, uno de síntesis de voz y un kit de desarrollo sobre LiveKit para crear agentes que conversan, consultan sistemas externos y, por ejemplo, reservan turnos. Promete transcripción en vivo con menos de medio segundo de demora y turnos de conversación de menos de un segundo.

La transcripción cuesta desde US$ 0,0035 por minuto y la voz sintética, US$ 13 por millón de caracteres. Mistral dice superar a Whisper y a Gemini en sus pruebas, que son propias. Se usa por API o en servidores del cliente; no informó si libera los pesos.

Fuente: Mistral AI (https://mistral.ai/news/voxtral-3/); The Decoder (https://the-decoder.com/mistral-ai-launches-voxtral-3-a-full-voice-agent-stack-that-listens-thinks-and-talks-in-real-time/)

### Amazon libera TorchNeuron para correr PyTorch en sus chips Trainium
*Martes, 20 de octubre de 2026.*

Basta con mover el modelo al dispositivo «neuron»: es el intento más directo de Amazon de restarle a Nvidia su ventaja en software.

AWS publicó el martes 20, en la PyTorch Conference de Norteamérica, la beta pública de TorchNeuron, un backend nativo de PyTorch para sus chips Trainium2 y Trainium3, con licencia Apache 2.0. El código existente funciona cambiando una línea, y admite torch.compile y entrenamiento distribuido con FSDP2 y paralelismo de tensores.

Deepgram informó que procesa cerca de 60% más segundos de audio por dólar que con GPUs. AWS reconoce límites: unos 22.000 casos de prueba de PyTorch todavía no tienen implementación nativa y faltan funciones como tensores dispersos y formas dinámicas.

Fuente: PyTorch (https://pytorch.org/blog/introducing-torchneuron-native-pytorch-backend-for-aws-trainium/)

### MiniMax acelera su modelo para agentes y baja 70% el costo de uso
*Lunes, 19 de octubre de 2026.*

M3.1 Flash promete casi el triple de velocidad y precios de US$ 0,15 por millón de tokens de entrada.

La china MiniMax lanzó el domingo 19 M3.1 Flash, orientado a programación y a agentes que manejan una computadora. Afirma superar los 200 tokens por segundo y abaratar 70% el costo de las tareas agénticas frente a su versión anterior. En sus pruebas declara 73,7% en DeepSWE y 61,7 puntos en OSWorld V2. Por ahora se usa por API; los pesos del modelo se publicarán más adelante.

Fuente: MiniMax (https://www.minimax.io/blog/minimax-m31f)

### OpenAI guarda el contexto hasta 12 horas
*Martes, 20 de octubre de 2026.*

Los modelos desde GPT-5.6 aceptan una caché de instrucciones de 12 horas en la API de respuestas. Escribirla cuesta 2,5 veces la tarifa normal de entrada; leerla, lo mismo que la caché de 30 minutos.

Fuente: OpenAI (https://developers.openai.com/api/docs/guides/prompt-caching)

## Tecnología

### Bandas de ransomware explotan una falla de las VPN de Palo Alto Networks
*Martes, 20 de octubre de 2026.*

El error permite saltear la autenticación de GlobalProtect y ya lo usan los grupos Qilin e Inc.

La unidad de investigación Unit 42 de Palo Alto Networks actualizó el lunes 19 y el martes 20 su alerta sobre la falla CVE-2026-0257, que afecta al portal y la puerta de enlace GlobalProtect del sistema PAN-OS y deja iniciar conexiones VPN sin credenciales válidas. Ahora la aprovechan operadores de ransomware como Qilin e Inc, que después se mueven por la red interna y roban credenciales.

La falla figura desde mayo en el catálogo de vulnerabilidades explotadas de la agencia estadounidense CISA. La empresa pide actualizar a una versión corregida, revisar los registros de GlobalProtect y no exponer la interfaz de administración en los puertos 4443 y 3879.

Fuente: Unit 42 (Palo Alto Networks) (https://unit42.paloaltonetworks.com/active-exploitation-of-pan-os-cve-2026-0257/)

### Meta muestra por dentro Prometheus, su supercomputadora de escala gigavatio
*Lunes, 19 de octubre de 2026.*

El primer tramo ya conecta cientos de miles de GPUs en Ohio; el objetivo es llegar a un millón trabajando a la par.

El equipo de ingeniería de Meta publicó el lunes 19 cómo construyó Prometheus, en New Albany, Ohio, donde hace dos años había un centro de datos común. Con la primera fase entrenó la familia de modelos Muse. Cada edificio enlaza hasta 20.736 GPUs por Ethernet y una red de agregación une edificios separados por hasta más de 100 kilómetros.

El dato que más destaca la empresa es la estabilidad: a mediados de 2025 sufría casi mil interrupciones diarias cada 8.000 GPUs y, tras un año de trabajo, las redujo 99%. Hoy aprovecha más del 85% del tiempo de cómputo en preentrenamiento. Su próxima gran instalación, Hyperion, está en Luisiana.

Fuente: Meta Engineering (https://engineering.fb.com/2026/10/19/data-center-engineering/inside-prometheus-meta-gigawatt-scale-supercluster/)

### Muse, la app de IA de Meta, llegó a 10 millones de descargas en Estados Unidos en 40 días
*Martes, 20 de octubre de 2026.*

Sólo otras 11 aplicaciones lo lograron tan rápido; por ahora no está disponible en la Argentina.

Según datos de Sensor Tower que publicó TechCrunch el martes 20, Muse, el asistente de Meta lanzado en septiembre, sumó 10,2 millones de descargas en Estados Unidos en sus primeros 40 días. En el mismo plazo, ChatGPT había tenido 3,7 millones; Grok, 500.000, y Claude, 200.000. El último en lograrlo había sido Threads, en 2023.

También retiene mejor: 30% de los usuarios sigue a los siete días, contra 19% de promedio de sus rivales. El 16 de octubre superó por primera vez los 2,5 millones de usuarios diarios. Sólo funciona en Estados Unidos y Canadá.

Fuente: TechCrunch (https://techcrunch.com/2026/10/20/metas-muse-hits-10m-u-s-downloads-in-40-days-a-milestone-reached-by-only-11-other-apps)

### Eka vale US$ 1.450 millones con un robot que «siente» lo que agarra
*Martes, 20 de octubre de 2026.*

Su modelo combina visión y fuerza y levanta unos 1.500 objetos por hora.

La startup fundada por el profesor del MIT Pulkit Agrawal y el ex DeepMind Tuomas Haarnoja levantó US$ 150 millones liderados por a16z y F-Prime. En lugar de guiarse sólo por imágenes, su modelo usa sensores de fuerza en la pinza, que cuesta menos de US$ 1.000. La empresa dice que acierta más del 95% de las veces, contra unos 600 objetos por hora de una persona.

Fuente: TechCrunch (https://techcrunch.com/2026/10/20/eka-is-worth-1-45-billion-thanks-to-a-physical-ai-model-that-has-experts-raving/)

### Los agentes de Notion ya pueden trabajar más de un día seguido
*Lunes, 19 de octubre de 2026.*

Antes cortaban a los cinco minutos; además, un enrutador elige el modelo y baja 90% el costo promedio.

Notion anunció el lunes 19 que sus agentes pueden dedicarse a una sola tarea durante más de 24 horas, porque cada sesión corre en un servicio propio que sobrevive a reinicios. Su enrutador automático elige el modelo para cada tarea y, según la empresa, logra resultados parecidos a Opus 5.5 y Astra a un costo promedio 90% menor. Los planes Business y Enterprise reciben 1.500 créditos estándar y 500 de selección por mes; los clientes actuales pasan al nuevo esquema el 2 de noviembre.

Fuente: Notion (https://www.notion.com/blog/notion-ai-more-for-less)

## Empresas de tecnología

### El borrador de la salida a bolsa de Anthropic muestra ingresos de US$ 16.300 millones en seis meses
*Martes, 20 de octubre de 2026.*

Según The Wall Street Journal, la empresa que desarrolla Claude gastó casi US$ 9.000 millones en cómputo en el semestre y tiene compromisos de nube por unos US$ 450.000 millones.

The Wall Street Journal accedió a un borrador del prospecto (el formulario S-1 que se presenta ante el regulador bursátil de Estados Unidos) con el que Anthropic prepara su salida a la bolsa Nasdaq, y publicó sus cifras el martes 20. Muestran un crecimiento pocas veces visto: US$ 16.300 millones de ingresos en el primer semestre de 2026, contra US$ 1.100 millones en el mismo período del año pasado. La oferta podría valuar a la compañía en unos US$ 2 billones (dos millones de millones).

El costo también es enorme. En seis meses, Anthropic gastó cerca de US$ 9.000 millones en cómputo e infraestructura, más que los US$ 7.300 millones de todo 2025. Tiene firmados contratos de nube por unos US$ 450.000 millones para la próxima década: US$ 111.000 millones con Google Cloud, US$ 110.000 millones con Amazon Web Services y US$ 31.000 millones con Microsoft. Si se suman las negociaciones en curso, el gasto potencial en capacidad llegaría a US$ 750.000 millones. Como las grandes nubes no le alcanzan, recurre también a centros de datos de terceros.

La pérdida neta del semestre fue de US$ 80.700 millones, aunque unos US$ 72.000 millones corresponden a ajustes contables sin salida de caja, ligados a notas convertibles y otros instrumentos de financiamiento. Entre los riesgos, el borrador menciona que cerca del 20% de los ingresos vino de sólo dos clientes, que los daños de un incidente grave de seguridad con IA podrían superar la cobertura de sus seguros y que la alineación de los modelos, es decir, que hagan lo que sus creadores pretenden, es un riesgo para el negocio.

El texto también revela que Dario y Daniela Amodei, director ejecutivo y presidenta, cobraron en 2025 un sueldo base de unos US$ 655.000 cada uno, que se comprometieron a donar el 80% de sus acciones y que la empresa prevé un fondo de beneficio público del 5%. No hay fecha oficial para el debut: en septiembre, el mismo diario había informado que Anthropic lo pasaba a noviembre para mostrar antes los números del tercer trimestre. Como se trata de un borrador, las cifras pueden cambiar en la versión pública del prospecto.

Fuente: Investing.com (sobre The Wall Street Journal) (https://www.investing.com/news/stock-market-news/anthropic-revenue-hits-163-billion-as-preliminary-s1-outlines-ipo-risks--wsj-4960928); Yahoo Finance (https://finance.yahoo.com/technology/ai/articles/anthropic-revenue-hits-16-3-201707100.html); The Decoder / Mixed (https://mixed-news.com/en/anthropic-ipo-november-third-quarter-numbers-report/)

### ByteDance, Alibaba y Tencent piden a Nvidia más de 3 millones de placas por US$ 35.000 millones
*Martes, 20 de octubre de 2026.*

Es el chip más potente que la compañía todavía puede vender en China, pero avisó que en 2027 no podrá fabricar más de 3 millones en todo el mundo.

Las tres tecnológicas chinas más grandes encargaron a Nvidia más de tres millones de placas RTX PRO 5500, según reveló Reuters el martes 20. A un precio de lista cercano a US$ 11.400 por unidad, el pedido supera los US$ 35.000 millones. Sumando a otros compradores del país, la demanda china ya pasa los seis millones de unidades, de acuerdo con dos fuentes citadas por la agencia.

El problema es la oferta. Nvidia les anticipó a sus clientes que no puede garantizar las entregas: indicó que en 2027 no fabricará más de tres millones de estas placas para todo el mundo, porque la capacidad de TSMC se va a volcar a Rubin, su próxima plataforma para centros de datos. Algunos socios recibirían apenas entre el 5% y el 10% de lo que pidieron. Las primeras muestras llegarían en diciembre y las entregas comerciales, desde el primer trimestre de 2027.

La RTX PRO 5500 es una placa de estación de trabajo, no un acelerador de centro de datos, pero quedó entre lo más potente que las reglas de exportación de Estados Unidos todavía permiten venderle a China: los B300 están vedados y los H200 requieren licencia caso por caso. Las empresas chinas la usarían sobre todo para inferencia, es decir, para hacer funcionar modelos ya entrenados. Un vocero de Nvidia criticó los controles, que según la compañía cubren productos de hace casi cinco años, mientras Huawei gana terreno en el mercado local.

El pedido muestra la escala del apetito chino por cómputo de IA pese a las restricciones. El modelo que la RTX PRO 5500 reemplaza en la práctica, la RTX 6000D, lanzada a mediados de 2025 para cumplir con los límites de exportación, ya fue discontinuado y su precio en China se duplicó, según Reuters. Para Nvidia, cuya participación en el mercado chino de chips para centros de datos había caído a casi cero, es una vía para volver a vender en volumen allí.

Fuente: Reuters (vía The Edge Malaysia) (https://theedgemalaysia.com/node/822533)

### Netflix gana más de lo esperado pero recorta su meta de publicidad y cae en bolsa
*Martes, 20 de octubre de 2026.*

Facturó US$ 12.870 millones en el tercer trimestre, 11,8% más que hace un año, con un margen operativo récord de 34,6%.

Netflix presentó el martes 20 sus resultados del tercer trimestre. Los ingresos fueron de US$ 12.874 millones, en línea con su previsión, y la ganancia neta subió 44%, a US$ 3.664 millones. La ganancia por acción fue de US$ 0,87, por encima de los US$ 0,82 que esperaba el mercado según Investing.com. El margen operativo llegó a 34,6%, contra 28,2% un año antes, sobre todo por el calendario de gastos.

Lo que no gustó fue el pronóstico. La empresa bajó su meta de ingresos por publicidad para 2026 de unos US$ 3.000 millones a cerca de US$ 2.700 millones, porque algunas funciones del negocio publicitario llegaron más tarde de lo previsto, y dejó su proyección anual de ingresos en US$ 51.100 millones, apenas debajo del rango anterior. Para el cuarto trimestre espera US$ 13.440 millones de ingresos y un margen de 26%, que incluye el costo del recorte de personal de este mes, de alrededor de 1.000 puestos.

La acción cayó 5,9% en las operaciones posteriores al cierre. Greg Peters, codirector ejecutivo, dijo que la publicidad crece más de 80% este año pero va «un poco atrás» de la meta. La guía para 2027 llegará en enero.

Fuente: StockTitan (comunicado de Netflix) (https://www.stocktitan.net/news/NFLX/netflix-q3-2026-earnings-revenue-12-billion-35pct-margin.html); Investing.com (https://www.investing.com/news/transcripts/earnings-call-transcript-netflix-beats-q3-2026-estimates-but-shares-fall-after-hours-93CH-4961240); Fast Company (https://www.fastcompany.com/91625107/tech-layoffs-2026-update-mass-job-cuts-october-netflix-hubspot-flock-more)

### Salesforce compra Braze por US$ 5.660 millones para su apuesta de marketing con IA
*Martes, 20 de octubre de 2026.*

Pagará US$ 47,50 por acción en efectivo; Braze se sumará a Marketing Cloud y a Agentforce.

Salesforce anunció el martes 20 que comprará Braze, la plataforma de mensajes y campañas que usan Canva, Instacart y Venmo, por un valor empresa cercano a US$ 5.660 millones. Pagará US$ 47,50 en efectivo por cada acción Clase A. Braze tiene unos 2.770 clientes y procesa billones de mensajes por año.

La operación busca darle a Marketing Cloud lo que Braze hace bien: reaccionar en tiempo real a lo que el usuario hace dentro de una app, con IA que decide qué mensaje, oferta, canal y horario usar. Salesforce dice que Braze se integrará con Data 360, Customer 360 y Agentforce, su plataforma de agentes.

El cierre se espera dentro del año fiscal 2028 de Salesforce, que empieza en febrero, y necesita la aprobación de los accionistas de Braze y de los reguladores. La compañía aclaró que no cambia sus proyecciones del año en curso.

Fuente: Salesforce (SEC 8-K) (https://www.sec.gov/Archives/edgar/data/0001108524/000119312526425881/d516983dex991.htm)

### La inteligencia artificial ya aporta más de la mitad de los ingresos de SpaceX
*Martes, 20 de octubre de 2026.*

La empresa facturó US$ 14.600 millones en el tercer trimestre y su segmento de IA, que incluye Grok y Cursor, explicó el 52%.

SpaceX informó el martes 20 ingresos por US$ 14.600 millones en el tercer trimestre. El 52% vino de su segmento rebautizado «Super Intelligence», que reúne el chatbot Grok, la herramienta de programación Cursor, comprada hace poco, y un negocio de alquiler de cómputo con 1,7 gigavatios de capacidad.

La inversión del trimestre fue de US$ 19.600 millones, con el centro de datos Colossus II y la nave Starship como destinos principales. TechCrunch señala que los números incluyen cerca de US$ 1.000 millones por la recuperación del precio del bitcoin.

Fuente: TechCrunch (https://techcrunch.com/2026/10/20/spacexs-ai-business-is-beating-expectations/)

### Nvidia invertirá en cuatro startups alemanas de robots, salud, sonido y satélites
*Lunes, 19 de octubre de 2026.*

Jensen Huang lo anunció en Berlín junto al canciller Friedrich Merz, que firmó un acuerdo para desarrollar IA aplicada a la industria.

Nvidia anunció el lunes 19 inversiones en Agile Robots, que fabrica robots y un humanoide para fábricas; Avelios Medical, que hace software para gestionar hospitales; Mirelo, que genera efectos de sonido y música para video, y Reflex Aerospace, que construye satélites. No informó montos: forman parte de un compromiso de casi US$ 10.000 millones para todo Europa.

El gobierno alemán firmó con la empresa una declaración de intención para trabajar en modelos de IA física. Siemens mostró en su planta de Erlangen sistemas con los que dice reducir hasta 85% el trabajo de ingeniería al poner en marcha una línea.

Fuente: Nvidia (https://blogs.nvidia.com/blog/germany-wants-to-lead-the-world-in-industrial-ai-how-nvidia-will-help/)

### Amazon promete invertir más de 16.000 millones de euros en Alemania en 2027
*Martes, 20 de octubre de 2026.*

Casi 5.000 millones irán a ampliar la región de nube de Frankfurt.

En la cumbre Invest in Germany de Berlín, con el canciller Friedrich Merz presente, Amazon anunció el martes 20 inversiones por más de 16.000 millones de euros para 2027. De ese total, 4.800 millones son para ampliar AWS en Frankfurt. Además abrirá un segundo laboratorio de robótica e IA en Berlín y confirmó 24 lanzamientos con Arianespace para Amazon Leo, su red de satélites de internet.

Fuente: Amazon (https://www.aboutamazon.com/company-news/amazon-germany-investment)

### Tenstorrent, la empresa de Jim Keller, levanta US$ 1.500 millones
*Lunes, 19 de octubre de 2026.*

Su valuación sube a US$ 6.200 millones, más del doble que hace dos años.

La fabricante de chips de IA basados en RISC-V cerró el lunes 19 una ronda Serie E liderada por Trace Capital e Innovation X, con Fidelity, Morgan Stanley, ARK y T. Rowe Price. Usará el dinero para producir más servidores Galaxy, su producto más vendido, y seguir con su ecosistema abierto. Entre sus clientes nombra a Virtu Financial y Equinix.

Fuente: SiliconANGLE (https://siliconangle.com/2026/10/19/chip-legend-jim-kellers-tenstorrent-raises-1-5b-to-expand-its-open-compute-ecosystem/)

### Tesla, Meta, IBM y SAP presentan hoy
*Miércoles, 21 de octubre de 2026.*

Después del cierre de Wall Street informan sus números Tesla, Meta, IBM, Texas Instruments, Lam Research y SAP. Para Tesla, el consenso espera ingresos de unos US$ 28.000 millones, casi iguales a los de hace un año.

Fuente: Opening Bell Daily (https://www.openingbelldailynews.com/p/stock-market-week-ahead-oct-19-2026); Electrek (https://electrek.co/2026/10/20/tesla-tsla-q3-2026-earnings-preview/)

### Otter consigue US$ 320 millones sin ceder acciones
*Martes, 20 de octubre de 2026.*

El fondo de General Catalyst cobra según el rendimiento del gasto en marketing.

La herramienta que transcribe y resume reuniones anunció el martes 20 un financiamiento de US$ 320 millones del Customer Value Fund de General Catalyst, que no toma participación accionaria. Otter dice que pasó los US$ 100 millones de ingresos recurrentes anuales el año pasado y que suma 40 millones de usuarios. Prueba resúmenes previos a cada reunión y un asistente que responde preguntas en vivo.

Fuente: TechCrunch (https://techcrunch.com/2026/10/20/otter-ai-raises-320-million-from-general-catalysts-growth-fund-for-its-meeting-tool/)

### Blackwall cuadruplica su valuación filtrando bots de IA
*Martes, 20 de octubre de 2026.*

La estonia levantó US$ 100 millones y vale US$ 2.200 millones.

Blackwall, que vende protección de tráfico web a través de empresas de hosting, cerró el martes 20 una Serie C liderada por AVP. Distingue visitantes reales y agentes de IA legítimos de bots maliciosos con huellas digitales del software y modelos propios. Los proveedores revenden la herramienta con su marca y comparten ingresos.

Fuente: TechCrunch (https://techcrunch.com/2026/10/20/blackwall-quadruples-valuation-to-2-2b-as-websites-wrangle-an-increasingly-crowded-internet/)

### Netflix presenta hoy sus resultados
*Martes, 20 de octubre de 2026.*

Después del cierre de Wall Street, Netflix informa el tercer trimestre. El mercado espera ingresos de unos US$ 12.870 millones; la propia empresa había proyectado US$ 12.860 millones.

Fuente: InsiderFinance (https://www.insiderfinance.io/news/netflix-q3-2026-earnings-oct-20)

## Impresión 3D

### OrcaSlicer 2.5 llega con plugins, mezcla de colores y un modo CAD
*Viernes, 16 de octubre de 2026.*

La versión alfa del laminador libre más usado en impresoras de filamento es la más grande de su historia: más de 400 cambios.

El equipo de OrcaSlicer publicó el 16 de octubre en GitHub la alfa de la versión 2.5. La novedad central es un sistema de plugins en Python, con su propio intérprete incluido; ya hay 53 publicados en el catálogo de Orca Cloud. Como pueden acceder a archivos y a internet, los desarrolladores piden instalar sólo los de confianza.

También incorpora mezcla de colores, que alterna capas finas de dos o tres filamentos para lograr tonos intermedios, relieves de textura aplicados al modelo y una pestaña experimental de diseño paramétrico con importación y exportación STEP. Suma soporte para impresoras de cinta, impresión en paralelo con dos a cuatro cabezales y las Bambu Lab H2C y A2L.

Es una versión de prueba: la estable sigue siendo la 2.4.2 y conviene hacer copia de los perfiles antes de instalarla.

Fuente: All3DP (https://all3dp.com/4/orcaslicer-to-get-plug-ins-color-mixing-and-native-parametric-cad/)

### SolidCraft, un CAD gratuito al estilo Fusion que escribieron agentes de Claude
*Sábado, 17 de octubre de 2026.*

El programa libre ya hace croquis con restricciones, extrusiones, ensambles y chapa, y exporta a STEP, STL y 3MF.

SolidCraft es una aplicación de diseño paramétrico gratuita y de código abierto que imita el espacio de diseño de Autodesk Fusion: se dibuja un croquis, se le ponen restricciones, se extruye y el modelo se recalcula al cambiar una cota. Según Botmonster, que lo analizó el 17 de octubre, el código lo escribieron agentes de Claude: el primer cambio del repositorio lleva la firma de Claude Opus 5.5 y la versión 0.14 salió diez días después.

Incluye revolución, barrido, transiciones, redondeos, roscas, patrones, parámetros, ensambles con uniones y chapa con desarrollo plano. Abre archivos de FreeCAD y Rhino, exporta a STEP, IGES, STL, 3MF y OBJ, y trae un servidor MCP para manejarlo desde un asistente de IA. Corre en Windows, macOS, Linux y en el navegador.

Sus autores lo definen como «temprano pero usable para piezas simples». Los redondeos pueden fallar, no tiene mecanizado ni simulación y las versiones para Windows y Mac no están firmadas, así que el sistema muestra advertencias al instalarlo.

Fuente: Botmonster (https://botmonster.com/ai/solidcraft-is-a-fusion-360-alternative-ai-wrote-in-10-days/)

### Berkeley libera una impresora volumétrica que imprime sin capas en 90 segundos
*Lunes, 19 de octubre de 2026.*

OpenCAL se arma con unos US$ 1.638 en piezas; Formlabs fabrica la resina y Prusa la vende.

La Universidad de California en Berkeley publicó todos los planos, el software y la receta de resina de OpenCAL. La técnica, litografía axial computada, proyecta patrones de luz sobre un frasco de resina que gira y la solidifica de una vez, sin capas ni soportes. Una réplica de El pensador de Rodin tardó 90 segundos.

Se arma en cinco o seis horas con un proyector LED común y una Raspberry Pi 5. El hardware usa la licencia abierta de Prusa y ya hay equipos en el MIT, Purdue y el NIST. En Estados Unidos, la resina cuesta US$ 119,99 el litro.

Fuente: VoxelMatters (https://www.voxelmatters.com/uc-berkeley-releases-opencal-an-open-source-volumetric-3d-printer-with-formlabs-and-prusa/)

### Siraya Tech vende soportes que se despegan solos para nailon y PPA
*Viernes, 16 de octubre de 2026.*

Los dos filamentos, de US$ 50 y US$ 60 el kilo, llenan el hueco que dejó Bambu Lab al discontinuar su soporte para PA y PET.

Siraya Tech lanzó Support PET y Support PPA, dos filamentos de sacrificio para imprimir soportes que se adhieren lo justo a la pieza y se arrancan limpios. El de PET sirve para PET, ABS, ASA, PPS, TPU y PA12; el de PPA, para PPA y PA6, incluidas las versiones con fibra de carbono o vidrio.

Cuestan US$ 49,99 y US$ 59,99 la bobina de 1 kg, sólo en Amazon de Estados Unidos. Piden boquilla endurecida, bloque calefactor de al menos 12 mm, entre 260 °C y 300 °C de boquilla y, para PPA, cámara cerrada. En impresoras multicolor requieren torre de purga.

Fuente: All3DP (https://all3dp.com/4/siraya-tech-launches-dedicated-breakaway-support-filaments-for-nylon-ppa-and-pet/)

### Unión en forma de C: la más fuerte para encastrar piezas de PLA sin pegamento
*Jueves, 15 de octubre de 2026.*

Un estudio irlandés comparó 135 ensambles inspirados en la carpintería japonesa y la C superó a la cola de milano.

Investigadores de la Universidad de Galway y la Universidad Tecnológica del Atlántico publicaron en Results in Engineering una prueba de tres uniones encastrables para PLA: cola de milano, C y T. Imprimieron 135 piezas en una Prusa MK4 con capas de 0,2 mm y relleno completo, y las sometieron a tracción.

La C con cuello de 5 mm resistió unos 7 MPa, más que las otras; agrandar el cuello a 7 mm la debilitó. Aun así, la mejor unión llega sólo al 16% de la resistencia de una pieza entera de PLA. Los laminadores ya generan colas de milano, pero la C hay que dibujarla en CAD.

Fuente: All3DP (https://all3dp.com/4/ditch-the-glue-researchers-find-c-shaped-joints-outperform-dovetails-in-pla-prints/)

### Formlabs baja a US$ 699 con su primera impresora de resina hogareña
*Miércoles, 14 de octubre de 2026.*

La Form Studio 1 usa la misma tecnología LCD que la Form 4, que arranca en US$ 2.625.

Formlabs abrió los pedidos el 14 de octubre y empieza a despachar el 16 de noviembre. Tiene un volumen de 200 × 125 × 235 mm y píxeles de 35 micrones. Las resinas de baja emisión cuestan desde US$ 29 el litro y la estación de lavado y curado, US$ 199. Apunta a usarse dentro de casa, con un extractor de vapores opcional.

Fuente: All3DP (https://all3dp.com/4/formlabs-form-studio-1/)

### Aparece en el laminador de Creality una impresora chica que todavía no anunció
*Lunes, 19 de octubre de 2026.*

La mBox tendría 153 mm por lado, firmware Klipper y gabinete cerrado.

Fabbaloo encontró el 19 de octubre en Creality Print 7.3 el perfil de una impresora «mBox» que la marca no presentó. Indica un volumen de 153 × 153 × 153 mm, mucho menor que los 256 mm habituales, boquilla de 0,4 mm, firmware Klipper con 300 mm/s de velocidad máxima y la opción de multifilamento con un solo cabezal, lo que sugiere compatibilidad con el sistema de colores CFS. Creality no dio información y el perfil podría desaparecer.

Fuente: Fabbaloo (https://www.fabbaloo.com/?p=241321)

### Solukon presenta una máquina para limpiar piezas metálicas de hasta una tonelada
*Lunes, 19 de octubre de 2026.*

La alemana Solukon mostró la SFM-AT850, un sistema que quita el polvo sobrante de piezas impresas en metal de hasta 650 × 650 × 800 mm y 1.000 kg, pensado para componentes hidráulicos o de motores de cohete. Estará disponible en el tercer trimestre de 2027 y se exhibirá en Formnext.

Fuente: 3DPrint.com (https://3dprint.com/335041/solukon-goes-big-with-new-sfm-at850-depowdering-system/)

### Creality renueva la Ender-3 con un modelo grande y uno de entrada
*Viernes, 16 de octubre de 2026.*

La Mega imprime piezas de hasta 42 cm por lado y acepta TPU; la Neo apunta a quien compra su primera impresora.

Creality lanzó el 16 de octubre la Ender-3 V3 Mega, con 420 × 420 × 420 mm de volumen, y la Ender-3 V3 Neo, de 220 mm por lado con nivelación automática. En preventa, el combo de la Mega con cuatro colores cuesta US$ 669 y el de la Neo, US$ 329. Además tomó reservas en Estados Unidos de la K3, de cuatro boquillas, desde US$ 849.

Fuente: VoxelMatters (https://www.voxelmatters.com/creality-launches-ender-3-v3-mega-and-neo-3d-printers/); 3DPrint.com (contenido patrocinado) (https://3dprint.com/334925/creality-k3-opens-for-pre-order-at-849-advancing-multi-color-3d-printing/)

### Prusa vende pellets: el material de su filamento, hasta 60% más barato
*Miércoles, 14 de octubre de 2026.*

El PLA en pellets sale unos US$ 11 por kilo, contra US$ 29,99 el carrete.

Prusa empezó a vender el 14 de octubre los pellets con los que fabrica su filamento Prusament, en PLA, PETG, ASA y PC Blend, en bolsas de 3,5 a 14 kilos. Sirven para impresoras de pellets de gran formato o para quien fabrica su propio filamento con una extrusora. La cuenta del ahorro no incluye la energía ni el material que se pierde al convertirlos.

Fuente: All3DP (https://all3dp.com/4/prusa-steps-into-pellet-3d-printing-with-prusament-pellets-up-to-60-cheaper-than-filament/)

### Bambu Lab anticipa su primer escáner 3D
*Jueves, 15 de octubre de 2026.*

El S1 saldrá en noviembre. Todavía no hay precio ni especificaciones.

Fuente: 3DPrint.com (https://3dprint.com/334952/bambu-lab-is-building-more-than-3d-printers-now-comes-the-s1-scanner/)

### Un piano impreso en 3D dentro de un set de LEGO
*Jueves, 15 de octubre de 2026.*

El set Venetian Neighbourhood, que sale el 4 de noviembre, trae un piano que suena, fabricado por sinterizado láser.

Fuente: All3DP (https://all3dp.com/6/the-second-mass-3d-printed-part-lego-piece-is-a-piano-that-play-notes/)

## Claude Tips de la semana

### Usá Claude Code como técnico de tu computadora
*Claude Code · Visto en Reddit (r/ClaudeAI)*

Un desarrollador que armaba con Claude Code una app para medir la temperatura de su Mac notó lecturas anormales. Claude Code revisó los procesos, encontró un minero de criptomonedas oculto que usaba casi 12 núcleos y estaba configurado para arrancar con la máquina, y antes de tocar nada propuso un plan y pidió permiso. El caso lo contó Tom's Hardware el 19 de octubre.

La idea sirve para cualquier compu lenta o caliente: Claude Code puede leer el estado del sistema y explicarte qué está pasando en lenguaje claro.

1. Abrí Claude Code en una carpeta de trabajo y pedile: «mi computadora anda lenta y caliente; listá los procesos que más CPU y memoria usan y los programas que arrancan solos, y explicame qué es cada uno».
2. Pedile que no borre nada: que proponga mover lo sospechoso a una carpeta de cuarentena y espere tu aprobación.
3. Confirmá después con un antivirus. Claude ayuda a encontrar el problema, pero no reemplaza un escaneo de seguridad.

### Pedile a Claude un tablero que se actualice solo
*claude.ai (Pro, Max, Team y Enterprise) · Visto en el newsletter How to AI, de Ruben Hassid*

Claude Dashboards salió en beta el 8 de octubre y en su newsletter del 14, Ruben Hassid contó cómo le saca provecho: en vez de pedir un gráfico, le plantea a Claude la decisión que tiene que tomar y lo deja elegir las cifras y los cortes.

Sirve porque el tablero queda conectado a la fuente de datos (BigQuery, Snowflake, Databricks o Salesforce, entre otras), muestra cuándo se actualizó cada gráfico y deja ver la consulta SQL detrás de cada número, así se puede controlar.

1. En un chat, tocá «Salida» y elegí «Dashboards», o abrí la pestaña Artefactos y usá una plantilla.
2. Pedí por la decisión: «¿cómo se comparan las altas de este mes por canal con las del mes pasado? Decime qué supuestos usaste».
3. Revisá la consulta de cualquier número y ajustá con frases como «pasalo a vista semanal».
4. Nace privado: compartilo con el botón «Compartir». En Enterprise lo activa un administrador y consume el límite de uso del plan.

## Dólar oficial en la semana (Banco Nación, cierre)

- Lunes, 19 de octubre de 2026: compra $ 1.490,00, venta $ 1.540,00
- Martes, 20 de octubre de 2026: compra $ 1.495,00, venta $ 1.545,00

Variación de la venta en el período: +0,32%.

## Lo que viene

- 16 de noviembre: Formlabs empieza a despachar la Form Studio 1.
- 17 al 19 de noviembre: Microsoft Ignite: llegan los controles de agentes de E7.
- Diciembre: Primeras muestras de la RTX PRO 5500 para compradores chinos.
- Hoy, tras el cierre de Wall Street: Resultados de Tesla, Meta, IBM, Texas Instruments, Lam Research y SAP.
- Noviembre: Debut previsto de Anthropic en la bolsa, según The Wall Street Journal.
- 17 al 20 de noviembre: Formnext, la feria de impresión 3D de Frankfurt.
- Enero: Netflix da su pronóstico para 2027.
- Tercer trimestre de 2027: Llega la SFM-AT850 de Solukon.
