[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | **Español** | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Claude%20Code%20Clone%20Template&fontSize=38&fontColor=ffffff&fontAlignY=38&desc=A%20portable%20snapshot%20of%20one%20person's%20Claude%20Code%20setup&descAlignY=58&descSize=17&descColor=ffffff&animation=fadeIn" alt="Claude Code Clone Template banner" width="100%"/>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-45%20curated-brightgreen)](#global-configskills)
[![Languages](https://img.shields.io/badge/languages-10-orange)](#top)
[![Template](https://img.shields.io/badge/type-adapt%2C%20not%20run%20as--is-lightgrey)](#caveat-this-is-one-persons-setup)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=17&pause=1200&color=6C63FF&center=true&vCenter=true&width=640&lines=45+curated+skills+with+full+provenance;Cost-aware+Sonnet+%2F+Opus+%2F+Haiku+model+routing;Git+safety+hooks+%2B+%2Fplan-pro+workflow;Cross-project+second-brain+vault" alt="rotating feature highlights"/>

</div>

Una instantánea portátil de la configuración de Claude Code de una persona: instrucciones globales, reglas de ingeniería, **45 skills seleccionadas** (7 de autoría propia —3 escritas desde cero, 4 wrappers propios sobre herramientas de terceros— 1 adaptada de una skill original, y el resto adoptadas de repositorios externos, todas con procedencia documentada por skill en `sources.json`), ejemplos reales de memoria, un manifiesto de procedencia de skills y una bóveda de conocimiento entre proyectos, todo empaquetado para que una instancia nueva de Claude Code (o la persona que la configura) pueda replicar los mismos hábitos de trabajo y capacidades en una máquina nueva. Esto es una **plantilla para adaptar, no una configuración para ejecutar tal cual**: se han eliminado los identificadores personales y sustituido por marcadores de posición, y varias secciones solo cobran sentido si además adoptas las herramientas que describen.

## Primeros pasos (inicio rápido)

**Atajo:** clona el repositorio, ábrelo en Claude Code y ejecuta `/adopt`; te hace una entrevista (qué piezas opcionales quieres, lista de plugins, rutas de destino) y realiza por ti los pasos 2-6 y 8-9 de abajo, marcando el progreso en un archivo de diario reanudable a medida que avanza. El paso 7 (instalar los propios ecosistemas de plugins) queda deliberadamente fuera del alcance de `/adopt`; ese sigue siendo trabajo tuyo. Los pasos manuales de abajo son lo que `/adopt` automatiza, y también están ahí para quien prefiera hacerlo a mano o revisar exactamente qué cambia antes de ejecutarlo.

1. **Clona el repositorio** en cualquier ubicación conveniente de la máquina de destino.
2. **Decide ahora la única pieza opcional** —responde sí/no, porque determina qué eliminas en el paso 5: la precompresión local con IA (Ollama). Consulta la sección "Opcional: ___" más abajo para más detalles.
3. **Copia `global-config/CLAUDE.md`, `agents/*.md`, `hooks/block-dangerous-git.py`, `skills/*` y `tools/`** a tu propio `~/.claude/` (fusiona o reemplaza, tú decides). Estos son los archivos que hacen que las reglas de enrutamiento, la barrera de seguridad de git, el catálogo de skills y el verificador de actualizaciones funcionen de verdad, no que se queden en simple prosa. **Antes de copiar `CLAUDE.md`, reescribe su sección "Installed Plugins" para que solo liste lo que realmente tienes instalado**: la copia del dueño original afirma que ciertos plugins están habilitados, y arrastrar eso tal cual hace que tu Claude mienta sobre las herramientas disponibles.
4. **Fusiona `global-config/settings.example.json`** en tu `~/.claude/settings.json` (después de reemplazar `<YOUR_HOME>`; en macOS/Linux también cambia el lanzador `py` del comando del hook por `python3`, esa entrada es específica de Windows tal como viene).
5. **Elimina Ollama si respondiste "no" en el paso 2.** Ruta rápida: los párrafos de Ollama en tu copia de CLAUDE.md + `notes/local-ollama-models.md` + `tools/ollama/`.
6. **Busca y reemplaza los marcadores de posición** en todo lo que conservaste; consulta el paso 8 de "Cómo adoptar esto" más abajo para la lista completa.
7. **Instala los ecosistemas de plugins referenciados** (superpowers, ecc, etc.); consulta "Qué más necesitarás instalar por tu cuenta" más abajo.
8. **Opcionalmente copia `notes/`** a la ubicación de tu propia bóveda de segundo cerebro, y **`memory-examples/`** a la carpeta de memoria automática de Claude Code del proyecto correspondiente.
9. **Inicia una sesión de Claude Code y verifica** que recogió el nuevo CLAUDE.md; por ejemplo, pide un plan de implementación y comprueba que se invoca `/plan-pro`, o pregunta sobre el enrutamiento de modelos y comprueba si aparece la escalera de costos.

El resto de este README explica cada pieza en detalle.

## Qué hay aquí

```
claude-clone-template/
├── README.md
├── LICENSE                                # MIT license for this repo's own content
├── ATTRIBUTION.md                         # Credits for the upstream repos the third-party skills were adopted from
├── .claude/commands/adopt.md              # Run `/adopt` in this repo to interview + auto-apply the steps below
├── global-config/
│   ├── CLAUDE.md                          # Global instruction file (~/.claude/CLAUDE.md equivalent)
│   ├── settings.example.json              # Sanitized ~/.claude/settings.json — hooks, plugins, model default
│   ├── agents/                            # 3 pinned-model subagent definitions (opus, haiku-batch, fable-medium)
│   ├── hooks/block-dangerous-git.py       # PreToolUse gate that asks before risky git commands
│   ├── rules/ecc-common/                  # 10 engineering-discipline rule files (ecc plugin ecosystem)
│   ├── skills/                            # 45 curated skill folders (the actual SKILL.md instructions, not just an index — see sources.json for provenance)
│   ├── SKILLS_INDEX.md                    # Personal index of installed skills/plugins + when to use which
│   ├── memory-examples/                   # 7 real auto-memory entries showing the memory system's format/patterns
│   ├── templates/                         # 2 starter templates to copy into a new repo (project-CLAUDE.md, conventions.md)
│   └── tools/
│       ├── skill-update-check/
│       │   ├── check.ps1                  # Weekly update checker — reads sources.json from this same folder
│       │   └── sources.json               # Real provenance manifest: 45 personal skills + 3 pip + 2 npm + 1 binary tool
│       └── ollama/ollama-digest.ps1       # On-demand local-model pre-digest helper (see the Ollama section below)
└── notes/                                 # 3 notes: a personal cross-project "second brain" vault (example content)
```

### `global-config/CLAUDE.md`
El corazón de la configuración. Codifica:

- **Enrutamiento de modelos sensible al costo**: bucle principal en Sonnet como orquestador, delegando a subagentes de Haiku/Opus/Fable según la dificultad de la tarea, con reglas estrictas sobre quién lee los archivos en bruto y quién lee solo las conclusiones.
- **Descarga de ejecución pesada**: enviar tareas grandes a sesiones separadas en lugar de inflar (y facturar de más) la sesión actual.
- **Flujo de planificación**: `/plan-pro` como planificador predeterminado.
- **Convención de la bóveda de segundo cerebro**: una sola regla ("¿está ligado a un solo repositorio?") que decide qué vive en la bóveda y qué en los docs/ADR de un repo.
- **Hook de seguridad de git**: una barrera PreToolUse que pide confirmación antes de comandos git destructivos.
- **Peculiaridades de shell**: reglas sobre la sintaxis de heredoc de la herramienta Bash frente a la herramienta PowerShell (un dolor de cabeza específico de Windows, aprendido a las malas).
- **Automonitoreo de contexto**: cuándo debe Claude sugerir proactivamente `/compact`.
- **Reglas anti-rasgos-de-IA en la escritura**: un conjunto completo de reglas en tailandés e inglés para lograr que el texto redactado se lea como escrito por un humano (vocabulario a evitar, patrones estructurales, ajuste de registro); la pieza más grande y de aplicación más amplia del archivo. El detalle de respaldo vive en `memory-examples/`.
- **PR en modo borrador por defecto**, **pedir confirmación antes de programar cron/agentes en la nube**, **narración escueta durante comandos de larga duración**, una **peculiaridad de grupos de pestañas compartidos de claude-in-chrome** para sesiones en paralelo, y una **comprobación proactiva de RLS de Supabase** para cualquier proyecto que use Supabase.

### `global-config/rules/ecc-common/`
Disciplina general de ingeniería del ecosistema de plugins ecc (everything-claude-code): flujo TDD, inmutabilidad, formato de commits, checklist de seguridad, niveles de severidad en revisión de código, delegación a agentes. Solo es útil si también usas ecc (consulta "Qué más necesitarás instalar" más abajo).

### `global-config/skills/`
45 carpetas `SKILL.md` seleccionadas (más scripts/referencias/datos de apoyo cuando una skill los tiene) que cubren oficio de escritura/marketing (copywriting, copy-editing, hallmark, marketing-council, pricing...), proceso de ingeniería (debug-mantra, poka-yoke, second-brain, dependency-audit, secrets-audit...), diseño (design-system, ui-ux-pro-max, banner-design, mobbin-references...) y meta-skills para gestionar el propio Claude Code (skillify, grilling, second-brain, graphify, plan-pro, shipping-a-branch...). `poka-yoke`, `plan-pro` y `shipping-a-branch` son de autoría propia desde cero; `graphify`, `dembrandt`, `markitdown` y `mobbin-references` son skills-wrapper propias cuyo SKILL.md es original pero cuyas herramientas subyacentes son de terceros (con crédito en `ATTRIBUTION.md` y seguimiento de versión en `sources.json`); `deslop-defaults` está adaptada (tomada de `ibelick/ui-skills` y reescrita de forma agnóstica al stack); el resto están adoptadas de repositorios externos; consulta `sources.json` para la procedencia por skill y `ATTRIBUTION.md` para los créditos de origen. Son artefactos de prompt-engineering genuinamente reutilizables, no meras descripciones de skills: cópialas en `~/.claude/skills/` y funcionan de inmediato.

<details>
<summary><b>Ver las 45 skills, agrupadas por categoría</b> (clic para expandir)</summary>

**Proceso de ingeniería y flujo de trabajo (15)**

| Skill | Qué hace |
|---|---|
| `debug-mantra` | Disciplina de depuración en cuatro pasos (reproducir → rastrear → refutar → cotejar) recitada antes de proponer cualquier arreglo. |
| `poka-yoke` *(autoría propia)* | Revisión a prueba de errores: hace que un estado incorrecto sea imposible o evidente desde el origen en lugar de detectarlo después. |
| `post-mortem` | Redacta el informe canónico de causa raíz después de arreglar y validar un bug. |
| `scrutinize` | Revisión desde una perspectiva externa de un plan/PR/diff: primero verifica la intención, luego rastrea la ruta de código real. |
| `shipping-a-branch` *(autoría propia)* | Guía commit → push → PR → revisión → merge de principio a fin, confirmando cada paso de riesgo por separado. |
| `plan-pro` *(autoría propia)* | Redactor de planes de implementación con un ciclo de revisión multiagente y salida HTML de antes/después. |
| `dependency-audit` | Revisa las dependencias del proyecto en busca de CVE conocidos y riesgos de cadena de suministro. |
| `secrets-audit` | Escanea el código fuente, el historial de git y la infraestructura en busca de credenciales filtradas y una postura débil de gestión de secretos. |
| `prompt-injection` | Audita apps/agentes en busca de inyección de prompts y vulnerabilidades en los límites de permisos de un LLM. |
| `decide` | Flujo de decisión estructurado (conjunto de preguntas al estilo 37signals) que además archiva la justificación. |
| `unstuck` | Banco de técnicas de pensamiento lateral para destrabar un obstáculo en lugar de reportar "no es posible". |
| `teach` | Enseña al usuario un concepto o habilidad nueva dentro del espacio de trabajo actual. |
| `wait-what` | Marca un mensaje que no quedó claro y lo replantea. |
| `skillify` | Crea, adapta o actualiza una skill de Claude Code (a partir de un chat, un video, un volcado o un repositorio externo). |
| `wizard` | Genera un asistente bash interactivo para pasos que solo puede realizar un humano (credenciales, paneles, migraciones). |

**Diseño y UI (11)**

| Skill | Qué hace |
|---|---|
| `banner-design` | Diseña banners sociales/publicitarios/web/impresos en muchos estilos de dirección de arte. |
| `design` | Skill de diseño amplia: logos, mockups de CIP, presentaciones, banners, iconos, fotos sociales. |
| `design-system` | Arquitectura de tokens de diseño en tres capas (primitivo → semántico → componente) más generación de presentaciones. |
| `deslop-defaults` *(adaptada)* | Valores predeterminados estructurales que evitan que una UI generada por IA se vea "promediada" (z-index, contención de acentos, estados). |
| `hallmark` | Skill de diseño anti-slop de IA para páginas nuevas, rediseños y extracción de diseño a partir de URLs/capturas de pantalla. |
| `ui-styling` | Construye UI accesible con shadcn/ui, Tailwind y theming consciente del modo oscuro. |
| `ui-ux-pro-max` | Base de datos consultable de UI/UX: estilos, paletas, combinaciones tipográficas, guías de UX, presets de animación, tipos de gráficos. |
| `mobbin-references` | Trae capturas de referencia de apps reales (onboarding, paywalls, estados vacíos...) antes de diseñar una UI. |
| `dembrandt` *(wrapper)* | Extrae los tokens de diseño reales de un sitio web en vivo (colores, tipografía, espaciado) mediante inspección de DOM/CSS. |
| `image` | Genera, edita y optimiza imágenes de marketing (heroes, gráficos sociales, mockups, imágenes OG). |
| `slides` | Construye presentaciones HTML estratégicas con Chart.js y theming basado en tokens de diseño. |

**Marketing, contenido y marca (13)**

| Skill | Qué hace |
|---|---|
| `brand` | Voz de marca, identidad visual, marcos de mensajería y comprobaciones de consistencia. |
| `community-marketing` | Estrategia de crecimiento liderada por comunidad (Discord/Slack/foro, programas de embajadores, advocacy). |
| `content-strategy` | Decide qué contenido crear: clústeres de temas, calendarios editoriales, pilares de contenido. |
| `copy-editing` | Edita, ajusta y refresca copy de marketing existente. |
| `copywriting` | Escribe copy de marketing nuevo para páginas de aterrizaje, precios, funciones y "acerca de". |
| `launch` | Planifica el lanzamiento de un producto, el anuncio de una función o un checklist de salida al mercado. |
| `management-talk` | Reescribe comunicación entre ingenieros para dirigirla a liderazgo, ajustada al canal de destino (Slack/email/standup). |
| `marketing-council` | Consejo asesor simulado de especialistas en marketing con nombre debatiendo una cuestión de posicionamiento. |
| `marketing-ideas` | Generador de ideas de crecimiento/marketing para productos SaaS y de software. |
| `marketing-psychology` | Aplica principios de ciencia del comportamiento (anclaje, prueba social, framing) a decisiones de marketing. |
| `pricing` | Estrategia de precios/empaquetado y auditorías de páginas de precios. |
| `product-marketing` | Construye el documento reutilizable de contexto de producto/audiencia/posicionamiento que consultan las demás skills de marketing. |
| `social` | Creación de contenido social, programación, reaprovechamiento y escucha social en distintas plataformas. |

**Investigación y gestión del conocimiento (6)**

| Skill | Qué hace |
|---|---|
| `deep-research` | Informe de investigación de múltiples fuentes y pasadas, con citas, contradicciones y vacíos. |
| `graphify` *(wrapper, autoría propia)* | Convierte cualquier entrada (código/docs/papers/imágenes) en un grafo de conocimiento agrupado con un informe de auditoría. |
| `grilling` | Interroga al usuario sin descanso para poner a prueba un plan antes de construirlo. |
| `second-brain` | Flujo de captura/compilación/consulta/lint/conexión para una bóveda de conocimiento personal al estilo Obsidian. |
| `watch-video` | Extrae contenido de transcripción/visual/multimodal de cualquier fuente de video compatible con yt-dlp. |
| `markitdown` *(wrapper)* | Convierte PDF/presentaciones/hojas de cálculo/audio/HTML/etc. en Markdown limpio para uso en LLM/RAG. |

La procedencia completa (repositorio de origen, fecha de adopción, si es de autoría propia, adoptada o adaptada) de cada entrada está en `global-config/tools/skill-update-check/sources.json`; los créditos de origen están en `ATTRIBUTION.md`.

</details>

### `global-config/memory-examples/`
7 entradas reales del sistema de memoria automática de Claude Code del dueño (no son datos específicos de un proyecto, sino hábitos portátiles de "cómo trabajo"): una desambiguación de convención de nombres para mensajería entre sesiones, el patrón de usar Ollama local como precompresión, una regla sobre qué significa realmente en la práctica "actualizar el cuaderno de skills", una peculiaridad de escapado de shell (`\b` convirtiéndose silenciosamente en un byte de retroceso), una entrada de retroalimentación sobre con cuánta agresividad recortar el exceso de contexto, y el detalle de respaldo completo (tablas de vocabulario + ejemplos de antes/después) de las reglas anti-rasgos-de-IA de escritura en CLAUDE.md, tanto en tailandés como en inglés. Existen para mostrar tanto la *forma* de una buena entrada de memoria (regla + por qué + cómo aplicarla) como su contenido concreto; consulta `global-config/rules/ecc-common/` para ver cómo encaja la memoria en el flujo de trabajo más amplio, y la sección "จำ/บัญญัติ" de CLAUDE.md para la distinción entre memoria local y global que usa este dueño.

### `global-config/tools/skill-update-check/sources.json`
El manifiesto real de adopción de skills/herramientas del dueño: datos de procedencia reales (URLs de repositorios de origen, notas de instalación, historial de versiones) para las 45 skills personales (incluidas las de autoría propia y las adaptadas), más 3 paquetes pip, 2 paquetes npm y 1 herramienta binaria. Junto con `check.ps1`, esto es lo que le permite a quien adopte `claude-clone-template` seguir las actualizaciones de origen de las skills que copió en `~/.claude/skills/`, igual que hace el dueño original. Los valores de `last_seen_commit` estarán en su mayoría en `unknown` o desactualizados desde la perspectiva del receptor hasta que ejecute `check.ps1 -Ack` una vez para establecer su propia línea base.

### `global-config/templates/`
Dos archivos iniciales pequeños (`project-CLAUDE.md`, `conventions.md`) para copiar en un repositorio nuevo en la primera configuración: un `CLAUDE.md` de proyecto tipo "enrutador" de ≤45 líneas y una plantilla de convenciones/green-gate. Cada uno tiene un bloque de comentarios con un PRESET para rellenar según el stack que estés configurando (por ahora solo un ejemplo de Python-web); añade tu propio preset del mismo modo si tu stack lo necesita.

### `notes/`
Contenido de ejemplo de la bóveda de segundo cerebro en Obsidian del dueño: inventario de modelos locales de Ollama, repositorios marcados y notas de referencia varias. Muestran *qué tipo de cosa* pertenece a una bóveda entre proyectos; no son imprescindibles universales. Conserva la idea de estructura y sustituye el contenido con el tuyo con el tiempo.

## Cómo adoptar esto

1. **Copia `global-config/CLAUDE.md`** en tu propio `~/.claude/CLAUDE.md`. Fusiónalo con lo que ya tengas, o reemplázalo por completo: tú decides. Léelo primero; elimina las secciones que no te apliquen. **Reescribe la sección "Installed Plugins" antes de hacer cualquier otra cosa con este archivo**: actualmente afirma que ciertos plugins concretos (superpowers, ecc, pordee, lazyweb, andrej-karpathy-skills) están instalados y habilitados, y le dice a Claude que no mencione instalarlos. Eso es cierto para el dueño original, no para ti. Sustitúyela por tu propia lista real de plugins, o bórrala hasta que hayas instalado algo.
2. **Copia `global-config/agents/*.md`** en `~/.claude/agents/` y **`global-config/hooks/block-dangerous-git.py`** en `~/.claude/hooks/`. Son estos archivos los que hacen que las reglas de enrutamiento de modelos y la barrera de seguridad de git de CLAUDE.md funcionen de verdad, en lugar de quedarse en simple prosa.
3. **Copia `global-config/skills/*`** en `~/.claude/skills/`. Aquí está el grueso del valor real: 45 carpetas de skills funcionales, no meras descripciones de ellas.
4. **Fusiona `global-config/settings.example.json`** en tu propio `~/.claude/settings.json` (reemplaza primero `<YOUR_HOME>` por tu ruta de inicio real). Fusiona, no sobrescribas, si ya tienes un settings.json: toma la entrada `hooks.PreToolUse` y lo que quieras de `enabledPlugins`. El comando del hook tal como se distribuye usa el lanzador `py` de Windows; en macOS/Linux, cámbialo primero a `python3`.
5. **Copia `global-config/rules/ecc-common/`** en `~/.claude/rules/` **solo si** instalas el plugin ecc. En caso contrario, omite este paso.
6. **Copia `global-config/memory-examples/*.md`** en la carpeta de memoria automática del proyecto al que quieras que se apliquen (la memoria automática de Claude Code es por proyecto, en `~/.claude/projects/<project>/memory/`), o léelas como referencia y escribe las tuyas desde cero.
7. **Copia `notes/`** en la ubicación de tu propia bóveda de segundo cerebro (cualquier carpeta que Obsidian u otras herramientas de markdown puedan ver), u omite este paso por completo si no quieres una bóveda.
8. **Busca y reemplaza cada marcador de posición**; este es el paso más importante:
   - `<YOUR_USERNAME>`, `<YOUR_HOME>` → tu nombre de usuario real de Windows/sistema y tu ruta de inicio
   - `<YOUR_VAULT_PATH>` → dondequiera que guardes (o planees guardar) tu bóveda de segundo cerebro
9. **Copia `global-config/tools/`** (tanto `skill-update-check/` como, si conservaste Ollama, `ollama/`) en `~/.claude/tools/`, y luego **establece tu propia línea base en `sources.json`**: ejecuta `check.ps1 -Ack` una vez después de copiar las skills, para que `last_seen_commit` refleje un punto de partida que tú controlas y no el historial del dueño original.

## Qué más necesitarás instalar por tu cuenta

Este repositorio contiene **referencias y reglas para** ecosistemas de skills, no los ecosistemas en sí. Para que las instrucciones de CLAUDE.md signifiquen algo, necesitas instalar:

- **superpowers** (obra/superpowers) — skills de brainstorming, redacción de planes, TDD, depuración
- **ecc / everything-claude-code** (affaan-m/ECC) — agentes, skills, comandos, servidores MCP
- Cualquier otro plugin nombrado en `SKILLS_INDEX.md` que decidas que quieres

Instálalos mediante el sistema de plugins de Claude Code en la máquina nueva, y luego concilia `SKILLS_INDEX.md` con lo que realmente instalaste.

---

## Una nota sobre el plan de suscripción y el nivel Fable 5.1

La escalera de enrutamiento de modelos en `CLAUDE.md` culmina en un subagente `fable-medium`: un nivel de escalado deliberadamente caro y de uso poco frecuente para los problemas más difíciles. El dueño original tiene un plan **Max**, donde ese modelo está disponible. Si tienes el plan **Pro** (o cualquier plan sin acceso a Fable 5.1), invocar `fable-medium` simplemente fallará.

Antes de copiar `CLAUDE.md` tal cual, comprueba qué plan tienes. Si no tienes Fable 5.1:
- Elimina los párrafos de `fable-medium` y la viñeta "สุดบันได" (tope de la escalera) de la sección de enrutamiento de modelos.
- Cambia el techo de la escalera para que se detenga en `opus`: la lógica de enrutamiento (escalar a Opus en trabajo difícil o de alto riesgo) sigue siendo válida, simplemente no tendrá un nivel por encima de Opus al cual escalar.
- Quita `global-config/agents/fable-medium.md` de lo que copies en `~/.claude/agents/`.

`/adopt` te pregunta esto como parte de su entrevista y hace este ajuste por ti; si copias los archivos a mano en su lugar, hazlo tú mismo para que Claude no siga intentando invocar un subagente al que tu plan no puede acceder.

---

## Opcional: IA local (Ollama) como precompresión

La configuración original usa modelos locales de Ollama como un **nivel de precompresión gratuito y con pérdida**: pasa texto largo y de bajo riesgo (logs, documentación extensa) por un modelo local para digerirlo *antes* de que entre en el contexto de un modelo de pago. Se sitúa **por debajo de Haiku** en la escalera de costos y no es un nivel de enrutamiento: sin acceso a herramientas, sin contexto del repositorio, solo texto de entrada y texto de salida. Ahorra dinero; no añade capacidad. Nada más en este repositorio depende de ello.

**Así que hay una pregunta que debes responderte a ti mismo: ¿quieres configurar modelos locales de Ollama para esto?**

### Si la respuesta es no
Omite esta sección entera. Elimina los párrafos de Ollama de tu copia de `CLAUDE.md` y descarta `notes/local-ollama-models.md`. Todo lo demás funciona bien sin ello.

### Si la respuesta es sí
1. **Instala Ollama** desde [ollama.com](https://ollama.com).
2. **Decide dónde vivirá el almacén de modelos.** Los modelos son grandes (un modelo de 27B ocupa decenas de GB) y la ubicación predeterminada está en tu unidad de sistema (`%USERPROFILE%\.ollama` en Windows). Si tu unidad de sistema anda justa de espacio, mueve el almacén a una unidad más grande; la configuración original usaba `D:\ollama` exactamente por esta razón. En Windows, define la variable de entorno `OLLAMA_MODELS` con la ruta elegida antes de descargar modelos; otras plataformas tienen enfoques equivalentes con variables de entorno o enlaces simbólicos.
3. **Descarga al menos un modelo de instrucciones de propósito general** (por ejemplo, `ollama pull qwen2.5:7b-instruct` o un modelo de instrucciones similar de ~7-9B: lo bastante pequeño para ir rápido, lo bastante bueno para resumir). El inventario original en `notes/local-ollama-models.md` muestra una posible combinación: un modelo pesado de 27B para la mejor calidad, modelos medianos de 7-9B para velocidad/razonamiento/código, y un modelo con capacidad de visión (`llava:7b`); toma esa lista como inspiración, no como lista de compras.
4. **Aprende el patrón de uso:** pasa un archivo por la tubería y obtén un resumen —
   ```powershell
   Get-Content <file> | ollama run <model> "<instruction>"
   ```
   (Pasa el archivo por la tubería; no metas prompts largos en el argumento.)
5. **Ten presente la única regla estricta:** la salida de un modelo local **nunca es verdad fundamental**. Es compresión con pérdida para texto de bajo riesgo. Si una decisión depende del contenido, el modelo de pago lee el original, siempre.

Esto es 100% opcional y se puede omitir. Existe únicamente para recortar el costo en tokens de texto masivo.

---

## Compatibilidad con otras herramientas de codificación con IA

Esta plantilla está construida específicamente para **Claude Code**. Los mecanismos de los que depende —un `CLAUDE.md` de carga automática, la herramienta `Skill`, los hooks de `settings.json`, las definiciones de subagentes— son funciones de Claude Code, no un formato de archivo portátil. Apuntar Codex CLI, ChatGPT, Antigravity, Cursor o cualquier otra herramienta a este repositorio no hará que "recoja" las skills o las reglas automáticamente; nada aquí funciona de fábrica fuera de Claude Code.

Lo que *sí* se puede adaptar a mano:
- `global-config/CLAUDE.md` es texto plano: copia las partes que quieras en un `AGENTS.md` (que Codex CLI y algunas otras herramientas sí leen) o en un prompt de sistema personalizado. Elimina primero todo lo que haga referencia a mecanismos específicos de Claude Code (spawn_task, la herramienta Skill, el enrutamiento de subagentes); eso no significará nada en otro lugar.
- Cada skill bajo `global-config/skills/<name>/SKILL.md` es solo un archivo de instrucciones en markdown. Puedes pegar una en las instrucciones personalizadas de otra herramienta, pero pierdes el disparo automático, y cualquier script incluido asume un shell que esa herramienta realmente pueda ejecutar.
- Los hooks (`settings.json`) y los archivos de subagentes (`agents/*.md`) son exclusivos de Claude Code; no hay un equivalente al que portarlos.

Si usas Codex/ChatGPT/Antigravity en tu día a día, este repositorio sigue siendo útil como *material de referencia* (las reglas de escritura, las correcciones de .docx, la lógica del hook de seguridad de git); simplemente espera copiar y pegar las partes relevantes en lugar de soltar la carpeta y que funcione sola.

---

## Advertencia: esta es la configuración de una sola persona

Esta instantánea proviene de un flujo de trabajo específico: un usuario bilingüe tailandés-inglés en una máquina Windows. Eso se nota en todas partes: las secciones bilingües en CLAUDE.md, las peculiaridades de PowerShell frente a Bash.

Adopta lo que te sea útil, descarta lo que no. Nada de esto es una mejor práctica prescriptiva: es lo que le funcionó a una persona, escrito con el detalle suficiente para ser portátil. El valor real está en la *forma* del sistema (enrutamiento por costo, descarga de trabajo pesado, un solo hogar por cada pieza de conocimiento, barreras de seguridad en comandos destructivos), no en ninguna regla individual.
