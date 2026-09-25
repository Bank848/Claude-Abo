[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | **Français** | [Deutsch](README.de.md) | [Русский](README.ru.md)

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Claude%20Code%20Clone%20Template&fontSize=38&fontColor=ffffff&fontAlignY=38&desc=A%20portable%20snapshot%20of%20one%20person's%20Claude%20Code%20setup&descAlignY=58&descSize=17&descColor=ffffff&animation=fadeIn" alt="Claude Code Clone Template banner" width="100%"/>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-45%20curated-brightgreen)](#global-configskills)
[![Languages](https://img.shields.io/badge/languages-10-orange)](#top)
[![Template](https://img.shields.io/badge/type-adapt%2C%20not%20run%20as--is-lightgrey)](#caveat-this-is-one-persons-setup)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=17&pause=1200&color=6C63FF&center=true&vCenter=true&width=640&lines=45+curated+skills+with+full+provenance;Cost-aware+Sonnet+%2F+Opus+%2F+Haiku+model+routing;Git+safety+hooks+%2B+%2Fplan-pro+workflow;Cross-project+second-brain+vault" alt="rotating feature highlights"/>

</div>

Un instantané portable de la configuration Claude Code d'une personne — instructions, skills, hooks, coffre de connaissances — packagé pour qu'une instance Claude Code toute neuve puisse reproduire les mêmes habitudes de travail. Ceci est **un template à adapter, pas une config à lancer telle quelle**.

<details>
<summary>Lire le pitch complet</summary>

Un instantané portable de la configuration Claude Code d'une personne — instructions globales, règles d'ingénierie, **45 skills sélectionnées** (7 conçues en interne — 3 écrites de zéro, 4 wrappers maison autour d'outils tiers — 1 adaptée d'une skill amont, le reste repris de dépôts amont, chacune avec sa provenance détaillée dans `sources.json`), des exemples de mémoire réels, un manifeste de provenance des skills, et un coffre de connaissances transversal aux projets — le tout packagé pour qu'une instance Claude Code toute neuve (ou la personne qui la configure) puisse reproduire les mêmes habitudes de travail et capacités sur une nouvelle machine. Ceci est un **template à adapter, pas une config à lancer telle quelle** : les identifiants personnels ont été retirés et remplacés par des placeholders, et plusieurs sections n'ont de sens que si vous adoptez aussi les outils qu'elles décrivent.

</details>

## Démarrage rapide (quickstart)

> **Raccourci :** clonez le dépôt, ouvrez-le dans Claude Code, et lancez `/adopt` — il vous interroge et fait les étapes 2, 3, 5 et 7 pour vous. L'étape 6 (installer les écosystèmes de plugins) est volontairement hors du périmètre.

<p align="center"><img src="assets/quickstart-flow.svg" alt="Clonez, puis copiez les configs, puis lancez /adopt, puis vérifiez" width="100%"/></p>

| # | Étape | Où |
|---|---|---|
| 1 | Clonez le dépôt | où bon vous semble |
| 2 | Décidez : voulez-vous la pré-compression locale par Ollama ? | voir [Optionnel : pré-compression par IA locale (Ollama)](#optionnel-pré-compression-par-ia-locale-ollama) |
| 3 | Copiez les configs dans `~/.claude/` | `CLAUDE.md`, `agents/*.md`, `hooks/*.py`, `skills/*`, `tools/` — **réécrivez d'abord « Installed Plugins »** |
| 4 | Fusionnez les settings | `global-config/settings.example.json` → `~/.claude/settings.json` (remplacez `<YOUR_HOME>`) |
| 5 | Remplacez tous les placeholders | liste complète dans [Comment adopter ceci](#comment-adopter-ceci), étape 8 |
| 6 | Installez les écosystèmes de plugins | voir [Ce qu'il vous faudra encore installer séparément](#ce-quil-vous-faudra-encore-installer-séparément) |
| 7 | Copiez `notes/` + `memory-examples/` (facultatif) | votre propre coffre de connaissances / dossier de mémoire automatique |
| 8 | Vérifiez | demandez un plan d'implémentation — est-ce que `/plan-pro` se déclenche ? |

Boîte multi-agents (Codex, Cursor, Gemini CLI, ...) ? Copiez aussi `global-config/AGENTS.md` dans chaque racine de projet — voir [Compatibilité avec d'autres outils de code IA](#compatibilité-avec-dautres-outils-de-code-ia).

Le reste de ce README détaille chaque pièce.

## Contenu du dépôt

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
Le cœur de la configuration. Il encode :

- **Le routage de modèles sensible au coût** — boucle principale sur Sonnet en orchestrateur, déléguant à des sous-agents Haiku/Opus/Fable selon la difficulté de la tâche, avec des règles strictes sur qui lit les fichiers bruts et qui lit les conclusions.
- **Le délestage des exécutions lourdes** — envoyer les gros travaux dans des sessions séparées plutôt que de gonfler (et de facturer) la session en cours.
- **Le workflow de planification** — `/plan-pro` comme planificateur par défaut.
- **La convention du coffre « second brain »** — une seule règle (« est-ce lié à un seul dépôt ? ») décidant ce qui vit dans le coffre plutôt que dans les docs/ADR d'un dépôt.
- **Le hook de sécurité git** — un garde-fou PreToolUse qui demande confirmation avant les commandes git destructrices.
- **Les pièges liés au shell** — les règles de heredoc entre l'outil Bash et l'outil PowerShell (une douleur spécifique à Windows, apprise à la dure).
- **L'auto-surveillance du contexte** — quand Claude doit proactivement suggérer `/compact`.
- **Les règles anti-tics-d'IA pour l'écriture** — un corpus complet thaï + anglais pour que le texte rédigé se lise comme écrit par un humain (vocabulaire à éviter, motifs structurels, adaptation du registre) ; la pièce la plus large et la plus largement réutilisable du fichier. Le détail de fond se trouve dans `memory-examples/`.
- **La préférence par défaut pour les PR en brouillon**, la **demande d'autorisation avant de programmer des tâches cron/cloud**, la **narration succincte pendant les commandes longues**, un **piège de groupe d'onglets partagé claude-in-chrome** pour les sessions parallèles, et une **vérification RLS Supabase proactive** pour tout projet utilisant Supabase.

### `global-config/rules/ecc-common/`
Discipline d'ingénierie générale issue de l'écosystème de plugins ecc (everything-claude-code) : workflow TDD, immutabilité, format de commit, checklist de sécurité, niveaux de gravité de revue de code, délégation aux agents. Utile uniquement si vous utilisez aussi ecc (voir « Ce qu'il vous faudra encore installer » plus bas).

### `global-config/skills/`
45 dossiers `SKILL.md` sélectionnés (plus scripts/référence/données annexes quand une skill en a) couvrant l'artisanat de l'écriture/marketing (copywriting, copy-editing, hallmark, marketing-council, pricing…), le processus d'ingénierie (debug-mantra, poka-yoke, second-brain, dependency-audit, secrets-audit…), le design (design-system, ui-ux-pro-max, banner-design, mobbin-references…), et des méta-skills pour piloter Claude Code lui-même (skillify, grilling, second-brain, graphify, plan-pro, shipping-a-branch…). `poka-yoke`, `plan-pro` et `shipping-a-branch` sont conçues de zéro en interne ; `graphify`, `dembrandt`, `markitdown` et `mobbin-references` sont des skills-wrappers maison dont le SKILL.md est original mais dont les outils sous-jacents sont tiers (crédités dans `ATTRIBUTION.md` et suivis en version dans `sources.json`) ; `deslop-defaults` est adaptée (reprise de `ibelick/ui-skills` et réécrite indépendamment de toute stack) ; le reste est repris de dépôts amont — voir `sources.json` pour la provenance skill par skill et `ATTRIBUTION.md` pour les crédits amont. Ce sont de véritables artefacts de prompt-engineering réutilisables, pas de simples descriptions de skills — copiez-les dans `~/.claude/skills/` et elles fonctionnent immédiatement.

<details>
<summary><b>Voir les 45 skills, regroupées par catégorie</b> (cliquez pour développer)</summary>

**Processus d'ingénierie et workflow (15)**

| Skill | Ce qu'elle fait |
|---|---|
| `debug-mantra` | Discipline de débogage en quatre étapes (reproduire → tracer → falsifier → recouper) récitée avant de proposer un correctif. |
| `poka-yoke` *(conçue en interne)* | Revue de mistake-proofing — rend un mauvais état impossible/évident à la source plutôt que de le détecter après coup. |
| `post-mortem` | Rédige le compte-rendu canonique de cause racine une fois un bug corrigé et validé. |
| `scrutinize` | Revue en perspective extérieure d'un plan/PR/diff — vérifie d'abord l'intention, puis retrace le chemin de code réel. |
| `shipping-a-branch` *(conçue en interne)* | Pilote de bout en bout commit → push → PR → revue → merge, en confirmant séparément chaque étape risquée. |
| `plan-pro` *(conçue en interne)* | Rédacteur de plans d'implémentation avec une boucle de revue multi-agents et une sortie HTML avant/après. |
| `dependency-audit` | Vérifie les dépendances du projet contre les CVE connues et les risques de chaîne d'approvisionnement. |
| `secrets-audit` | Scanne le code source, l'historique git et l'infra à la recherche d'identifiants exposés et d'une mauvaise gestion des secrets. |
| `prompt-injection` | Audite les applications/agents pour les vulnérabilités d'injection de prompt et de dépassement des limites d'autorisation LLM. |
| `decide` | Workflow de décision structuré (questionnaire façon 37signals) qui archive aussi le raisonnement. |
| `unstuck` | Banque de techniques de pensée latérale pour débloquer un obstacle au lieu de conclure « impossible ». |
| `teach` | Enseigne à l'utilisateur un nouveau concept/une nouvelle compétence dans l'espace de travail courant. |
| `wait-what` | Signale un message qui n'a pas atteint sa cible et le reformule. |
| `skillify` | Crée, adapte ou met à jour une skill Claude Code (à partir d'un chat, d'une vidéo, d'un dump, ou d'un dépôt externe). |
| `wizard` | Génère un assistant bash interactif pour les étapes que seul un humain peut réaliser (identifiants, tableaux de bord, migrations). |

**Design et UI (11)**

| Skill | Ce qu'elle fait |
|---|---|
| `banner-design` | Conçoit des bannières social/pub/web/print dans de nombreux styles de direction artistique. |
| `design` | Skill de design large — logos, maquettes CIP, slides, bannières, icônes, photos social. |
| `design-system` | Architecture de tokens de design à trois couches (primitif → sémantique → composant) plus génération de slides. |
| `deslop-defaults` *(adaptée)* | Réglages structurels par défaut qui empêchent une UI générée par IA d'avoir un rendu « lissé » (z-index, sobriété des accents, états). |
| `hallmark` | Skill de design anti-slop-IA pour les pages neuves, les refontes, et l'extraction de design depuis des URL/captures d'écran. |
| `ui-styling` | Construit une UI accessible avec shadcn/ui, Tailwind, et un thème sensible au mode sombre. |
| `ui-ux-pro-max` | Base de données UI/UX consultable — styles, palettes, associations de polices, guidelines UX, presets de motion, types de graphiques. |
| `mobbin-references` | Récupère des captures d'écran d'applications réelles en référence (onboarding, paywalls, états vides…) avant de concevoir une UI. |
| `dembrandt` *(wrapper)* | Extrait les tokens de design réels d'un site web en ligne (couleurs, typographie, espacement) via inspection DOM/CSS. |
| `image` | Génère/édite/optimise des images marketing (visuels héros, graphismes social, maquettes, images OG). |
| `slides` | Construit des présentations HTML stratégiques avec Chart.js et un thème par tokens de design. |

**Marketing, contenu et marque (13)**

| Skill | Ce qu'elle fait |
|---|---|
| `brand` | Voix de marque, identité visuelle, cadres de messaging, et vérifications de cohérence. |
| `community-marketing` | Stratégie de croissance portée par la communauté (Discord/Slack/forum, programmes d'ambassadeurs, advocacy). |
| `content-strategy` | Décide quel contenu créer — clusters thématiques, calendriers éditoriaux, piliers de contenu. |
| `copy-editing` | Édite/resserre/rafraîchit un texte marketing existant. |
| `copywriting` | Rédige un nouveau texte marketing pour pages d'atterrissage/tarification/fonctionnalités/à propos. |
| `launch` | Planifie un lancement de produit, une annonce de fonctionnalité, ou une checklist de mise sur le marché. |
| `management-talk` | Réécrit une communication d'ingénieur à ingénieur pour un public managérial, adaptée au canal cible (Slack/e-mail/standup). |
| `marketing-council` | Conseil consultatif simulé de marketeurs nommés débattant d'une question de positionnement. |
| `marketing-ideas` | Générateur d'idées de croissance/marketing pour les produits SaaS et logiciels. |
| `marketing-psychology` | Applique des principes de sciences comportementales (ancrage, preuve sociale, cadrage) aux décisions marketing. |
| `pricing` | Stratégie de tarification/packaging et audits de pages tarifaires. |
| `product-marketing` | Construit le document de contexte réutilisable produit/audience/positionnement auquel se réfèrent les autres skills marketing. |
| `social` | Création de contenu social, planification, réemploi de contenu, et veille sociale multiplateforme. |

**Recherche et gestion des connaissances (6)**

| Skill | Ce qu'elle fait |
|---|---|
| `deep-research` | Brief de recherche multi-source et multi-passe avec citations, contradictions et lacunes identifiées. |
| `graphify` *(wrapper, conçue en interne)* | Transforme n'importe quelle entrée (code/docs/articles/images) en graphe de connaissances groupé avec un rapport d'audit. |
| `grilling` | Interroge l'utilisateur sans relâche pour éprouver un plan avant de le construire. |
| `second-brain` | Workflow capture/compilation/interrogation/lint/connexion pour un coffre de connaissances personnel façon Obsidian. |
| `watch-video` | Extrait le contenu transcript/visuel/multimodal de toute source vidéo supportée par yt-dlp. |
| `markitdown` *(wrapper)* | Convertit PDF/slides/tableurs/audio/HTML/etc. en Markdown propre pour usage LLM/RAG. |

La provenance complète (dépôt source, date d'adoption, conçue en interne vs. adoptée vs. adaptée) pour chaque entrée se trouve dans `global-config/tools/skill-update-check/sources.json` ; les crédits amont sont dans `ATTRIBUTION.md`.

</details>

### `global-config/memory-examples/`
7 entrées réelles issues du système de mémoire automatique Claude Code du propriétaire (pas des faits spécifiques à un projet, mais des habitudes portables de « façon de travailler ») : une clarification de convention de nommage pour la messagerie inter-sessions, le motif « Ollama local comme pré-compression », une règle sur ce que signifie concrètement « mettre à jour le carnet de skills », un piège de guillemetage shell (`\b` devenant silencieusement un octet de retour arrière), une entrée de retour d'expérience sur l'agressivité avec laquelle réduire l'encombrement du contexte, et le détail complet (tableaux de vocabulaire + exemples avant/après) des règles anti-tics-d'IA d'écriture dans CLAUDE.md, en thaï comme en anglais. Elles existent pour montrer la *forme* d'une bonne entrée de mémoire (règle + pourquoi + comment l'appliquer) autant que leur contenu spécifique — voir `global-config/rules/ecc-common/` pour la place de la mémoire dans le workflow plus large, et la section « จำ/บัญญัติ » de CLAUDE.md pour la distinction mémoire locale/globale utilisée par ce propriétaire.

### `global-config/tools/skill-update-check/sources.json`
Le manifeste réel d'adoption de skills/outils du propriétaire — données de provenance authentiques (URL des dépôts sources, notes d'installation, historique de version) pour les 45 skills personnelles (y compris celles conçues en interne et adaptées) plus 3 paquets pip, 2 paquets npm, et 1 outil binaire. Associé à `check.ps1`, c'est ce qui permet à quiconque adopte `claude-clone-template` de suivre les mises à jour amont des skills copiées dans `~/.claude/skills/`, de la même façon que le propriétaire d'origine. Les valeurs `last_seen_commit` sont surtout `unknown`/obsolètes du point de vue du destinataire jusqu'à ce qu'il exécute `check.ps1 -Ack` une fois pour établir sa propre base de référence.

### `global-config/templates/`
Deux petits fichiers de démarrage (`project-CLAUDE.md`, `conventions.md`) à copier dans un nouveau dépôt lors de la première configuration — un CLAUDE.md de projet « routeur » de ≤ 45 lignes et un template de conventions/green-gate. Chacun a un bloc de commentaire avec un PRESET à remplir pour la stack que vous mettez en place (actuellement seulement un exemple Python-web) ; ajoutez votre propre preset de la même façon si votre stack en a besoin d'un.

### `notes/`
Contenu d'exemple issu du coffre second-brain Obsidian du propriétaire : inventaire des modèles Ollama locaux, dépôts mis en favoris, et notes de référence diverses. Elles montrent *quel genre de chose* appartient à un coffre transversal aux projets — ce ne sont pas des incontournables universels. Gardez l'idée de structure, remplacez le contenu par le vôtre au fil du temps.

## Comment adopter ceci

1. **Copiez `global-config/CLAUDE.md`** vers votre propre `~/.claude/CLAUDE.md`. Fusionnez-le avec ce que vous avez déjà, ou remplacez-le carrément — à vous de voir. Lisez-le d'abord ; supprimez les sections qui ne s'appliquent pas à vous. **Réécrivez la section « Installed Plugins » avant toute autre chose sur ce fichier** — elle affirme actuellement que des plugins spécifiques (superpowers, ecc, pordee, lazyweb, andrej-karpathy-skills) sont installés et activés, et dit à Claude de ne pas mentionner qu'il faut les installer. C'est vrai pour le propriétaire d'origine, pas pour vous. Remplacez-la par votre propre liste réelle de plugins, ou supprimez-la jusqu'à ce que vous ayez installé quelque chose.
2. **Copiez `global-config/agents/*.md`** dans `~/.claude/agents/` et **`global-config/hooks/block-dangerous-git.py`** dans `~/.claude/hooks/`. Ce sont ces fichiers qui rendent les règles de routage de modèles et le garde-fou de sécurité git de CLAUDE.md réellement fonctionnels, plutôt que simple prose.
3. **Copiez `global-config/skills/*`** dans `~/.claude/skills/`. C'est l'essentiel de la valeur réelle — 45 dossiers de skills fonctionnels, pas de simples descriptions.
4. **Fusionnez `global-config/settings.example.json`** dans votre propre `~/.claude/settings.json` (remplacez d'abord `<YOUR_HOME>` par votre vrai chemin home). Fusionnez, n'écrasez pas, si vous avez déjà un settings.json — reprenez l'entrée `hooks.PreToolUse` et ce que vous voulez d'`enabledPlugins`. La commande du hook livrée utilise le lanceur Windows `py` ; sur macOS/Linux, changez-le d'abord en `python3`.
5. **Copiez `global-config/rules/ecc-common/`** dans `~/.claude/rules/` **uniquement si** vous installez le plugin ecc. Sinon, sautez cette étape.
6. **Copiez `global-config/memory-examples/*.md`** dans le dossier de mémoire automatique du projet auquel vous voulez qu'elles s'appliquent (la mémoire automatique de Claude Code est par projet, dans `~/.claude/projects/<project>/memory/`), ou lisez-les comme référence et écrivez les vôtres de zéro.
7. **Copiez `notes/`** vers votre propre emplacement de coffre second-brain (n'importe quel dossier qu'Obsidian ou un outil markdown ordinaire peut voir), ou sautez entièrement cette étape si vous ne voulez pas de coffre.
8. **Remplacez chaque placeholder** — c'est l'étape la plus importante :
   - `<YOUR_USERNAME>`, `<YOUR_HOME>` → votre nom d'utilisateur Windows/système réel et votre chemin home
   - `<YOUR_VAULT_PATH>` → l'endroit où vous conservez (ou prévoyez de conserver) votre coffre second-brain
9. **Copiez `global-config/tools/`** (à la fois `skill-update-check/` et, si vous avez conservé Ollama, `ollama/`) dans `~/.claude/tools/`, puis **définissez votre propre base de référence dans `sources.json`** : lancez `check.ps1 -Ack` une fois après avoir copié les skills, pour que `last_seen_commit` reflète un point de départ que vous contrôlez plutôt que l'historique du propriétaire d'origine.

## Ce qu'il vous faudra encore installer séparément

Ce dépôt contient des **références et des règles pour** des écosystèmes de skills — pas les écosystèmes eux-mêmes. Pour que les instructions de CLAUDE.md aient un sens, vous devez installer :

- **superpowers** (obra/superpowers) — skills de brainstorming, écriture de plans, TDD, débogage
- **ecc / everything-claude-code** (affaan-m/ECC) — agents, skills, commandes, serveurs MCP
- Tout autre plugin nommé dans `SKILLS_INDEX.md` que vous décidez de vouloir

Installez-les via le système de plugins de Claude Code sur la nouvelle machine, puis réconciliez `SKILLS_INDEX.md` avec ce que vous avez réellement installé.

---

## Une note sur le plan d'abonnement et le palier Fable 5.1

L'échelle de routage de `CLAUDE.md` culmine avec un sous-agent `fable-medium`, qui nécessite un plan Max — sur Pro, le lancer échoue simplement. `/adopt` pose la question et corrige ça pour vous.

<details>
<summary>Correctif manuel si vous n'êtes pas sur Max</summary>

L'échelle de routage de modèles dans `CLAUDE.md` culmine avec un sous-agent `fable-medium` — un palier d'escalade délibérément coûteux et rarement utilisé pour les problèmes les plus difficiles. Le propriétaire d'origine est sur un plan **Max**, où ce modèle est disponible. Si vous êtes sur **Pro** (ou tout plan sans accès à Fable 5.1), lancer `fable-medium` échouera simplement.

Avant de copier `CLAUDE.md` tel quel, vérifiez quel plan vous avez. Si vous n'avez pas Fable 5.1 :
- Supprimez les paragraphes `fable-medium` et la puce « สุดบันได » (sommet de l'échelle) de la section de routage de modèles.
- Changez le plafond de l'échelle pour qu'elle s'arrête à `opus` — la logique de routage (escalader vers Opus sur les travaux difficiles/à fort enjeu) tient toujours, elle n'aura juste plus de palier au-dessus d'Opus vers lequel escalader.
- Retirez `global-config/agents/fable-medium.md` de ce que vous copiez dans `~/.claude/agents/`.

`/adopt` pose cette question dans le cadre de son interview et fait cette modification pour vous ; si vous copiez les fichiers à la main à la place, faites-le vous-même pour que Claude n'essaie pas sans cesse de lancer un sous-agent que votre plan ne peut pas atteindre.

</details>

---

## Optionnel : pré-compression par IA locale (Ollama)

Un palier de pré-compression gratuit et à perte — un modèle local digère du texte long à faible enjeu avant qu'il n'entre dans le contexte d'un modèle payant. Aucune capacité ajoutée, pur gain de coût. Facultatif ; rien d'autre ici n'en dépend.

<details>
<summary>Détails — voulez-vous de ça ?</summary>

La configuration d'origine utilise des modèles Ollama locaux comme **palier de pré-compression gratuit et à perte** — faire passer du texte long et à faible enjeu (logs, docs verbeuses) par un modèle local pour le digérer *avant* qu'il n'entre dans le contexte d'un modèle payant. Ce palier se situe **sous Haiku** dans l'échelle de coûts et n'en est pas un niveau de routage : pas d'accès aux outils, pas de contexte de dépôt, texte en entrée / texte en sortie uniquement. Ça économise de l'argent ; ça n'ajoute aucune capacité. Rien d'autre dans ce dépôt n'en dépend.

**Donc, une question à laquelle vous devez répondre vous-même : voulez-vous configurer des modèles Ollama locaux pour ça ?**

### Si non
Sautez toute cette section. Supprimez les paragraphes Ollama de votre copie de `CLAUDE.md` et retirez `notes/local-ollama-models.md`. Tout le reste fonctionne très bien sans ça.

### Si oui
1. **Installez Ollama** depuis [ollama.com](https://ollama.com).
2. **Décidez où vivra le stockage des modèles.** Les modèles sont volumineux (un modèle 27B fait des dizaines de Go) et l'emplacement par défaut est sur votre disque système (`%USERPROFILE%\.ollama` sous Windows). Si votre disque système manque de place, déplacez le stockage vers un disque plus grand — la configuration d'origine utilisait `D:\ollama` précisément pour cette raison. Sous Windows, définissez la variable d'environnement `OLLAMA_MODELS` vers le chemin choisi avant de télécharger des modèles ; les autres plateformes ont des approches équivalentes par variable d'environnement ou lien symbolique.
3. **Téléchargez au moins un modèle d'instruction généraliste** (par ex. `ollama pull qwen2.5:7b-instruct` ou un modèle d'instruction similaire d'environ 7 à 9 milliards de paramètres — assez petit pour tourner vite, assez bon pour résumer). L'inventaire d'origine dans `notes/local-ollama-models.md` montre une répartition possible : un 27B lourd pour la meilleure qualité, des modèles 7-9B de taille moyenne pour la vitesse/le raisonnement/le code, et un modèle capable de vision (`llava:7b`) — traitez cette liste comme une inspiration, pas comme une liste de courses.
4. **Apprenez le motif d'utilisation :** faites passer un fichier en entrée, obtenez un condensé en sortie —
   ```powershell
   Get-Content <file> | ollama run <model> "<instruction>"
   ```
   (Faites passer le fichier en pipe ; ne fourrez pas de longs prompts dans l'argument.)
5. **Retenez la seule règle stricte :** la sortie d'un modèle local n'est **jamais** la vérité terrain. C'est une compression à perte pour du texte à faible enjeu. Si une décision dépend du contenu, le modèle payant lit l'original — toujours.

Ceci est à 100 % optionnel et peut être ignoré. Ça n'existe que pour réduire les coûts de tokens sur du texte en masse.

</details>

---

## Compatibilité avec d'autres outils de code IA

Deux fichiers sont livrés au lieu d'un : `CLAUDE.md` (spécifique à Claude Code) et `AGENTS.md` (le sous-ensemble portable — [agents.md](https://agents.md), aussi lu par Codex, Cursor, Gemini CLI, Copilot).

<details>
<summary>Comment les deux fichiers interagissent</summary>

Ce template est construit spécifiquement pour **Claude Code**. Les mécanismes sur lesquels il repose — un `CLAUDE.md` chargé automatiquement, l'outil `Skill`, les hooks `settings.json`, les définitions de sous-agents — sont des fonctionnalités de Claude Code, pas un format de fichier portable. Pointer Codex CLI, ChatGPT, Antigravity, Cursor, ou tout autre outil vers ce dépôt ne le fera pas « récupérer » automatiquement les skills ou les règles ; rien ici ne fonctionne prêt à l'emploi en dehors de Claude Code.

Ce qui *peut* être adapté à la main :
- `global-config/CLAUDE.md` est du texte brut — copiez les parties qui vous intéressent dans un `AGENTS.md` (que Codex CLI et quelques autres outils lisent) ou un prompt système personnalisé. Retirez d'abord tout ce qui fait référence à des mécanismes spécifiques à Claude Code (spawn_task, l'outil Skill, le routage de sous-agents) — ça ne voudra rien dire ailleurs.
- Chaque skill sous `global-config/skills/<name>/SKILL.md` n'est qu'un fichier d'instructions markdown. Vous pouvez en coller une dans les instructions personnalisées d'un autre outil, mais vous perdez le déclenchement automatique, et tout script embarqué suppose un shell que l'outil peut réellement exécuter.
- Les hooks (`settings.json`) et les fichiers de sous-agents (`agents/*.md`) sont spécifiques à Claude Code — il n'existe aucun équivalent vers lequel les porter.

Si vous utilisez Codex/ChatGPT/Antigravity au quotidien, ce dépôt reste utile comme *matériel de référence* (les règles d'écriture, les corrections .docx, la logique du hook de sécurité git) — attendez-vous simplement à copier/coller les parties pertinentes plutôt qu'à déposer le dossier et le voir fonctionner tel quel.

</details>

---

## Avertissement : ceci est la configuration d'une seule personne

Cet instantané vient d'un workflow spécifique : un utilisateur bilingue thaï-anglais sur une machine Windows. Ça se voit partout — les sections bilingues dans CLAUDE.md, les pièges PowerShell contre Bash.

Adoptez ce qui est utile, écartez ce qui ne l'est pas. Rien de tout ceci n'est une bonne pratique prescriptive — c'est ce qui a fonctionné pour une personne, écrit de façon suffisamment claire pour être portable. La vraie valeur est la *forme* du système (routage par coût, délestage du travail lourd, un seul foyer par élément de connaissance, garde-fous sur les commandes destructrices), pas telle ou telle règle individuelle.
