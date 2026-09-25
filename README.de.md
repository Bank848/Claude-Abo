[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | **Deutsch** | [Русский](README.ru.md)

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Claude%20Code%20Clone%20Template&fontSize=38&fontColor=ffffff&fontAlignY=38&desc=A%20portable%20snapshot%20of%20one%20person's%20Claude%20Code%20setup&descAlignY=58&descSize=17&descColor=ffffff&animation=fadeIn" alt="Claude Code Clone Template banner" width="100%"/>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-45%20curated-brightgreen)](#global-configskills)
[![Languages](https://img.shields.io/badge/languages-10-orange)](#top)
[![Template](https://img.shields.io/badge/type-adapt%2C%20not%20run%20as--is-lightgrey)](#caveat-this-is-one-persons-setup)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=17&pause=1200&color=6C63FF&center=true&vCenter=true&width=640&lines=45+curated+skills+with+full+provenance;Cost-aware+Sonnet+%2F+Opus+%2F+Haiku+model+routing;Git+safety+hooks+%2B+%2Fplan-pro+workflow;Cross-project+second-brain+vault" alt="rotating feature highlights"/>

</div>

Ein portables Abbild der Claude-Code-Einrichtung einer einzelnen Person — globale Anweisungen, Engineering-Regeln, **45 kuratierte Skills** (7 selbst verfasst — 3 komplett neu geschrieben, 4 selbst geschriebene Wrapper um Drittanbieter-Tools — 1 aus einem Upstream-Skill adaptiert, der Rest aus Upstream-Repos übernommen, jeweils mit vollständiger Herkunftsangabe pro Skill in `sources.json`), echte Memory-Beispiele, ein Skill-Herkunftsmanifest und ein projektübergreifendes Wissens-Vault — so verpackt, dass eine frische Claude-Code-Instanz (oder die Person, die sie einrichtet) dieselben Workflow-Gewohnheiten und Fähigkeiten auf einer neuen Maschine bootstrappen kann. Dies ist eine **Vorlage zum Anpassen, keine Konfiguration zum unveränderten Ausführen**: Persönliche Kennungen wurden entfernt und durch Platzhalter ersetzt, und mehrere Abschnitte ergeben nur Sinn, wenn man auch die dort beschriebenen Tools übernimmt.

## Erste Schritte (Schnellstart)

**Abkürzung:** Repo klonen, in Claude Code öffnen und `/adopt` ausführen — das interviewt dich (welche optionalen Bausteine du willst, Plugin-Liste, Zielpfade) und erledigt die Schritte 2–6 und 8–9 unten für dich, wobei der Fortschritt in einer fortsetzbaren Journal-Datei abgehakt wird. Schritt 7 (die Installation der Plugin-Ökosysteme selbst) liegt bewusst außerhalb des Umfangs von `/adopt` — den musst du noch selbst erledigen. Die manuellen Schritte unten sind das, was `/adopt` automatisiert, und sie stehen auch für alle bereit, die es lieber per Hand machen oder genau nachvollziehen wollen, was sich ändert, bevor sie es ausführen.

1. **Repo klonen** an einen beliebigen praktischen Ort auf der Zielmaschine.
2. **Jetzt den einen optionalen Baustein entscheiden** — mit Ja/Nein beantworten, da dies bestimmt, was du in Schritt 5 löschst: lokale KI-Vorverdichtung (Ollama). Details siehe Abschnitt „Optional: ___" weiter unten.
3. **`global-config/CLAUDE.md`, `agents/*.md`, `hooks/block-dangerous-git.py`, `skills/*` und `tools/` kopieren** in dein eigenes `~/.claude/` (zusammenführen oder ersetzen — deine Entscheidung). Das ist es, was die Routing-Regeln, das Git-Sicherheitsgate, den Skill-Katalog und den Update-Checker tatsächlich funktionsfähig macht, nicht nur als Prosa lesbar. **Bevor du `CLAUDE.md` kopierst, schreibe den Abschnitt „Installed Plugins" so um, dass er nur das auflistet, was du wirklich installiert hast** — die Kopie des ursprünglichen Besitzers behauptet, bestimmte Plugins seien aktiviert; das unverändert zu übernehmen lässt dein Claude über die verfügbare Werkzeugausstattung lügen.
4. **`global-config/settings.example.json` zusammenführen** mit deiner `~/.claude/settings.json` (nachdem du `<YOUR_HOME>` ersetzt hast; unter macOS/Linux außerdem den `py`-Launcher im Hook-Befehl auf `python3` ändern — dieser Eintrag ist wie ausgeliefert Windows-spezifisch).
5. **Ollama löschen, falls du in Schritt 2 „nein" gesagt hast.** Schnelldurchgang: die Ollama-Absätze in deiner CLAUDE.md-Kopie + `notes/local-ollama-models.md` + `tools/ollama/`.
6. **Die Platzhalter suchen und ersetzen** in allem, was du behalten hast — die vollständige Liste steht in Schritt 8 von „So übernimmst du das" weiter unten.
7. **Die referenzierten Plugin-Ökosysteme installieren** (superpowers, ecc usw.) — siehe „Was du noch separat installieren musst" weiter unten.
8. **Optional `notes/` kopieren** in deinen eigenen Second-Brain-Vault-Speicherort, und **`memory-examples/`** in den Claude-Code-Auto-Memory-Ordner des jeweiligen Projekts.
9. **Eine Claude-Code-Session starten und prüfen**, ob die neue CLAUDE.md übernommen wurde — z. B. um einen Implementierungsplan bitten und schauen, ob `/plan-pro` aufgerufen wird, oder nach Modell-Routing fragen und sehen, ob die Kostenleiter zurückkommt.

Der Rest dieser README erklärt jeden Baustein im Detail.

## Was hier drinsteckt

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
Das Herzstück der Einrichtung. Es kodiert:

- **Kostenbewusstes Modell-Routing** — Hauptloop auf Sonnet als Orchestrator, der je nach Aufgabenschwierigkeit an Haiku-/Opus-/Fable-Subagenten delegiert, mit festen Regeln dazu, wer Rohdateien liest und wer nur Schlussfolgerungen.
- **Auslagerung schwerer Ausführungsarbeit** — große Jobs in separate Sessions auslagern, statt die aktuelle Session aufzublähen (und teurer abzurechnen).
- **Planungs-Workflow** — `/plan-pro` als Standardplaner.
- **Second-Brain-Vault-Konvention** — eine einzige Regel („Ist es an ein Repo gebunden?"), die entscheidet, was ins Vault gehört und was in die docs/ADRs eines Repos.
- **Git-Sicherheits-Hook** — ein PreToolUse-Gate, das vor destruktiven Git-Befehlen nachfragt.
- **Shell-Fallstricke** — Regeln zur Heredoc-Syntax von Bash-Tool vs. PowerShell-Tool (Windows-spezifische Schmerzen, mühsam erlernt).
- **Kontext-Selbstüberwachung** — wann Claude proaktiv `/compact` vorschlagen soll.
- **Anti-KI-Tell-Schreibregeln** — ein vollständiges Thai- und Englisch-Regelwerk, damit entworfene Texte wie von Menschen geschrieben wirken (zu vermeidendes Vokabular, strukturelle Muster, Registerabgleich); der größte und am breitesten wiederverwendbare Teil der Datei. Die zugehörigen Details liegen in `memory-examples/`.
- **Standardmäßig Draft-first bei PRs**, **Cron-/Cloud-Agenten nur nach Rückfrage einplanen**, **knappe Kommentierung während lang laufender Befehle**, ein **claude-in-chrome-Fallstrick zu geteilten Tab-Gruppen** bei parallelen Sessions, sowie ein **proaktiver Supabase-RLS-Check** für jedes Projekt, das Supabase nutzt.

### `global-config/rules/ecc-common/`
Allgemeine Engineering-Disziplin aus dem ecc-(everything-claude-code-)Plugin-Ökosystem: TDD-Workflow, Unveränderlichkeit, Commit-Format, Sicherheits-Checkliste, Schweregrade für Code-Reviews, Agenten-Delegation. Nur nützlich, wenn du auch ecc einsetzt (siehe „Was du noch installieren musst" weiter unten).

### `global-config/skills/`
45 kuratierte `SKILL.md`-Ordner (plus unterstützende Skripte/Referenz-/Datendateien, wo ein Skill sie hat) zu Schreib-/Marketing-Handwerk (copywriting, copy-editing, hallmark, marketing-council, pricing …), Engineering-Prozess (debug-mantra, poka-yoke, second-brain, dependency-audit, secrets-audit …), Design (design-system, ui-ux-pro-max, banner-design, mobbin-references …) und Meta-Skills zur Verwaltung von Claude Code selbst (skillify, grilling, second-brain, graphify, plan-pro, shipping-a-branch …). `poka-yoke`, `plan-pro` und `shipping-a-branch` sind komplett neu selbst verfasst; `graphify`, `dembrandt`, `markitdown` und `mobbin-references` sind selbst geschriebene Wrapper-Skills, deren SKILL.md original ist, deren zugrundeliegende Tools aber von Drittanbietern stammen (Credits in `ATTRIBUTION.md`, Versionsverfolgung in `sources.json`); `deslop-defaults` ist adaptiert (aus `ibelick/ui-skills` übernommen und Stack-agnostisch umgeschrieben); der Rest wurde aus Upstream-Repos übernommen — Herkunft pro Skill siehe `sources.json`, Upstream-Credits siehe `ATTRIBUTION.md`. Das sind echte, wiederverwendbare Prompt-Engineering-Artefakte, keine bloßen Skill-Beschreibungen — kopiere sie nach `~/.claude/skills/` und sie funktionieren sofort.

<details>
<summary><b>Alle 45 Skills, nach Kategorie gruppiert</b> (zum Ausklappen klicken)</summary>

**Engineering-Prozess & Workflow (15)**

| Skill | Was er tut |
|---|---|
| `debug-mantra` | Vierstufige Debugging-Disziplin (reproduzieren → verfolgen → falsifizieren → querverweisen), die vor jedem Fix-Vorschlag rezitiert wird. |
| `poka-yoke` *(selbst verfasst)* | Fehlervermeidendes Review — macht einen Fehlerzustand an der Quelle unmöglich/offensichtlich, statt ihn erst im Nachhinein abzufangen. |
| `post-mortem` | Verfasst den kanonischen Root-Cause-Bericht, nachdem ein Bug behoben und verifiziert wurde. |
| `scrutinize` | Review eines Plans/PRs/Diffs aus Außenperspektive — prüft zuerst die Absicht, verfolgt dann den tatsächlichen Codepfad. |
| `shipping-a-branch` *(selbst verfasst)* | Führt Commit → Push → PR → Review → Merge durch, jeden riskanten Schritt einzeln bestätigt. |
| `plan-pro` *(selbst verfasst)* | Autor für Implementierungspläne mit gespawntem Multi-Agenten-Review-Loop und HTML-Vorher/Nachher-Ausgabe. |
| `dependency-audit` | Prüft Projektabhängigkeiten auf bekannte CVEs und Supply-Chain-Risiken. |
| `secrets-audit` | Durchsucht Quellcode, Git-Historie und Infrastruktur nach durchgesickerten Zugangsdaten und schwacher Secrets-Verwaltung. |
| `prompt-injection` | Prüft Apps/Agenten auf Prompt-Injection und LLM-Berechtigungsgrenzen-Schwachstellen. |
| `decide` | Strukturierter Entscheidungs-Workflow (Fragenkatalog im 37signals-Stil), der die Begründung außerdem archiviert. |
| `unstuck` | Sammlung lateraler Denktechniken, um eine Blockade zu knacken, statt „nicht möglich" zu melden. |
| `teach` | Vermittelt dem Nutzer ein neues Konzept/eine neue Fähigkeit im aktuellen Arbeitsbereich. |
| `wait-what` | Markiert eine Nachricht, die nicht angekommen ist, und formuliert sie neu. |
| `skillify` | Erstellt, adaptiert oder aktualisiert einen Claude-Code-Skill (aus Chat, Video, Dump oder einem externen Repo). |
| `wizard` | Erzeugt einen interaktiven Bash-Wizard für Schritte, die nur ein Mensch ausführen kann (Zugangsdaten, Dashboards, Migrationen). |

**Design & UI (11)**

| Skill | Was er tut |
|---|---|
| `banner-design` | Entwirft Social-/Werbe-/Web-/Print-Banner in vielen Art-Direction-Stilen. |
| `design` | Breit angelegter Design-Skill — Logos, CIP-Mockups, Folien, Banner, Icons, Social-Fotos. |
| `design-system` | Dreischichtige Design-Token-Architektur (primitiv → semantisch → Komponente) plus Folien-Generierung. |
| `deslop-defaults` *(adaptiert)* | Strukturelle Vorgaben, die verhindern, dass KI-generiertes UI „durchschnittlich" wirkt (z-Index, Akzent-Zurückhaltung, States). |
| `hallmark` | Anti-KI-Slop-Design-Skill für Greenfield-Seiten, Redesigns und Design-Extraktion aus URLs/Screenshots. |
| `ui-styling` | Baut barrierefreie UI mit shadcn/ui, Tailwind und Dark-Mode-bewusstem Theming. |
| `ui-ux-pro-max` | Durchsuchbare UI/UX-Datenbank — Stile, Paletten, Font-Pairings, UX-Richtlinien, Motion-Presets, Diagrammtypen. |
| `mobbin-references` | Holt echte Referenz-Screenshots aus Apps (Onboarding, Paywalls, Empty States …), bevor ein UI entworfen wird. |
| `dembrandt` *(Wrapper)* | Extrahiert die tatsächlichen Design-Tokens einer Live-Website (Farben, Typografie, Abstände) per DOM-/CSS-Inspektion. |
| `image` | Generiert/bearbeitet/optimiert Marketing-Bilder (Hero-Bilder, Social-Grafiken, Mockups, OG-Images). |
| `slides` | Baut strategische HTML-Präsentationen mit Chart.js und Design-Token-Theming. |

**Marketing, Content & Brand (13)**

| Skill | Was er tut |
|---|---|
| `brand` | Markenstimme, visuelle Identität, Messaging-Frameworks und Konsistenzprüfungen. |
| `community-marketing` | Community-getriebene Wachstumsstrategie (Discord/Slack/Forum, Ambassador-Programme, Advocacy). |
| `content-strategy` | Entscheidet, welcher Content erstellt wird — Themencluster, Redaktionskalender, Content-Säulen. |
| `copy-editing` | Bearbeitet/strafft/aktualisiert bestehende Marketing-Texte. |
| `copywriting` | Schreibt neue Marketing-Texte für Landing-/Preis-/Feature-/Über-uns-Seiten. |
| `launch` | Plant einen Produktlaunch, eine Feature-Ankündigung oder eine Go-to-Market-Checkliste. |
| `management-talk` | Schreibt Engineer-zu-Engineer-Texte für die Führungsebene um, angepasst an den Zielkanal (Slack/E-Mail/Standup). |
| `marketing-council` | Simuliertes Beratungsgremium aus namentlich benannten Marketern, die eine Positionierungsfrage diskutieren. |
| `marketing-ideas` | Ideengenerator für Wachstum/Marketing bei SaaS- und Software-Produkten. |
| `marketing-psychology` | Wendet verhaltenswissenschaftliche Prinzipien (Anchoring, Social Proof, Framing) auf Marketing-Entscheidungen an. |
| `pricing` | Preis-/Paketierungsstrategie und Audits von Preisseiten. |
| `product-marketing` | Erstellt das wiederverwendbare Produkt-/Zielgruppen-/Positionierungs-Kontextdokument, auf das andere Marketing-Skills verweisen. |
| `social` | Erstellung, Planung, Wiederverwertung und Social Listening von Social-Content über Plattformen hinweg. |

**Recherche & Wissensmanagement (6)**

| Skill | Was er tut |
|---|---|
| `deep-research` | Multi-Source-, Multi-Pass-Recherche-Brief mit Zitaten, Widersprüchen und Lücken. |
| `graphify` *(Wrapper, selbst verfasst)* | Verwandelt beliebige Eingaben (Code/Docs/Papers/Bilder) in einen geclusterten Wissensgraphen mit Audit-Bericht. |
| `grilling` | Befragt den Nutzer unnachgiebig, um einen Plan vor dem Bauen auf Herz und Nieren zu prüfen. |
| `second-brain` | Erfassen/Kompilieren/Abfragen/Linten/Verknüpfen-Workflow für ein persönliches Obsidian-artiges Wissens-Vault. |
| `watch-video` | Extrahiert Transkript-/visuellen/multimodalen Inhalt aus jeder von yt-dlp unterstützten Videoquelle. |
| `markitdown` *(Wrapper)* | Konvertiert PDFs/Folien/Tabellen/Audio/HTML usw. in sauberes Markdown für LLM-/RAG-Nutzung. |

Die vollständige Herkunft (Quell-Repo, Übernahmedatum, selbst verfasst vs. übernommen vs. adaptiert) für jeden Eintrag steht in `global-config/tools/skill-update-check/sources.json`; Upstream-Credits stehen in `ATTRIBUTION.md`.

</details>

### `global-config/memory-examples/`
7 echte Einträge aus dem Auto-Memory-System des Besitzers in Claude Code (keine projektspezifischen Fakten, sondern portable „so arbeite ich"-Gewohnheiten): eine Begriffsklärung zur Namenskonvention für sessionübergreifendes Messaging, das Muster „lokales Ollama als Vorverdichtung", eine Regel dazu, was „das Skill-Notizbuch aktualisieren" operativ tatsächlich bedeutet, ein Shell-Quoting-Fallstrick (`\b` wird stillschweigend zu einem Backspace-Byte), ein Feedback-Eintrag dazu, wie aggressiv Kontext-Bloat getrimmt werden soll, sowie die vollständigen Hintergrunddetails (Vokabeltabellen + Vorher/Nachher-Beispiele) für die Anti-KI-Tell-Schreibregeln aus der CLAUDE.md, sowohl auf Thai als auch auf Englisch. Diese Beispiele sollen vor allem die *Form* eines guten Memory-Eintrags zeigen (Regel + Warum + Anwendung), nicht nur ihren konkreten Inhalt — siehe `global-config/rules/ecc-common/` dazu, wie Memory in den größeren Workflow passt, und den Abschnitt „จำ/บัญญัติ" der CLAUDE.md für die lokal-vs-global-Memory-Unterscheidung, die dieser Besitzer verwendet.

### `global-config/tools/skill-update-check/sources.json`
Das tatsächliche Skill-/Tool-Übernahmemanifest des Besitzers — echte Herkunftsdaten (Quell-Repo-URLs, Installationshinweise, Versionshistorie) für alle 45 persönlichen Skills (einschließlich der selbst verfassten und adaptierten) plus 3 pip-Pakete, 2 npm-Pakete und 1 Binär-Tool. Zusammen mit `check.ps1` ermöglicht dies einem `claude-clone-template`-Übernehmer, Upstream-Updates der in `~/.claude/skills/` kopierten Skills zu verfolgen — genauso wie es der ursprüngliche Besitzer tut. Die Werte von `last_seen_commit` sind aus Sicht des Empfängers größtenteils `unknown`/veraltet, bis er einmal `check.ps1 -Ack` ausführt, um seine eigene Baseline festzulegen.

### `global-config/templates/`
Zwei kleine Starterdateien (`project-CLAUDE.md`, `conventions.md`), die beim Ersteinrichten in ein neues Repo kopiert werden — eine ≤45-zeilige „Router"-Projekt-CLAUDE.md und eine Vorlage für Conventions/Green-Gate. Jede enthält einen Kommentarblock mit einem ausfüllbaren PRESET für den jeweiligen Stack, den du bootstrappst (derzeit nur ein Python-Web-Beispiel); ergänze bei Bedarf dein eigenes Preset auf dieselbe Weise für deinen Stack.

### `notes/`
Beispielinhalt aus dem Obsidian-Second-Brain-Vault des Besitzers: lokales Ollama-Modellinventar, gebookmarkte Repos und diverse Referenznotizen. Sie zeigen, *welche Art von Dingen* in ein projektübergreifendes Vault gehört — sie sind keine universellen Pflichtinhalte. Behalte die Struktur-Idee bei und ersetze den Inhalt mit der Zeit durch deinen eigenen.

## So übernimmst du das

1. **`global-config/CLAUDE.md` kopieren** in deine eigene `~/.claude/CLAUDE.md`. Führe sie mit dem zusammen, was du schon hast, oder ersetze sie komplett — deine Entscheidung. Lies sie zuerst; lösche Abschnitte, die auf dich nicht zutreffen. **Schreibe den Abschnitt „Installed Plugins" um, bevor du sonst irgendetwas mit dieser Datei machst** — er behauptet derzeit, bestimmte Plugins (superpowers, ecc, pordee, lazyweb, andrej-karpathy-skills) seien installiert und aktiviert, und weist Claude an, das Installieren nicht zu erwähnen. Das stimmt für den ursprünglichen Besitzer, nicht für dich. Ersetze ihn durch deine eigene tatsächliche Plugin-Liste, oder lösche ihn, bis du etwas installiert hast.
2. **`global-config/agents/*.md` kopieren** nach `~/.claude/agents/` und **`global-config/hooks/block-dangerous-git.py`** nach `~/.claude/hooks/`. Das ist es, was die Modell-Routing-Regeln und das Git-Sicherheitsgate aus der CLAUDE.md tatsächlich funktionsfähig macht, statt nur Prosa zu bleiben.
3. **`global-config/skills/*` kopieren** nach `~/.claude/skills/`. Das ist der Großteil des eigentlichen Werts — 45 funktionierende Skill-Ordner, nicht nur ihre Beschreibungen.
4. **`global-config/settings.example.json` zusammenführen** mit deiner eigenen `~/.claude/settings.json` (ersetze zuerst `<YOUR_HOME>` durch deinen echten Home-Pfad). Führe zusammen, statt zu überschreiben, falls du schon eine settings.json hast — übernimm den Eintrag `hooks.PreToolUse` und was du sonst noch aus `enabledPlugins` haben willst. Der ausgelieferte Hook-Befehl nutzt den Windows-`py`-Launcher; unter macOS/Linux zuerst auf `python3` ändern.
5. **`global-config/rules/ecc-common/` kopieren** nach `~/.claude/rules/` **nur, wenn** du das ecc-Plugin installierst. Andernfalls überspringen.
6. **`global-config/memory-examples/*.md` kopieren** in den Auto-Memory-Ordner des jeweiligen Projekts, für das sie gelten sollen (Claude-Code-Auto-Memory ist pro Projekt unter `~/.claude/projects/<project>/memory/`), oder lies sie als Referenz und schreibe deine eigenen von Grund auf.
7. **`notes/` kopieren** an deinen eigenen Second-Brain-Vault-Speicherort (jeder Ordner, den Obsidian oder simple Markdown-Tools sehen können), oder ganz überspringen, wenn du kein Vault willst.
8. **Jeden Platzhalter suchen und ersetzen** — das ist der wichtigste Schritt:
   - `<YOUR_USERNAME>`, `<YOUR_HOME>` → dein tatsächlicher Windows-/System-Benutzername und Home-Pfad
   - `<YOUR_VAULT_PATH>` → wo auch immer du dein Second-Brain-Vault führst (oder führen willst)
9. **`global-config/tools/` kopieren** (sowohl `skill-update-check/` als auch, falls du Ollama behalten hast, `ollama/`) nach `~/.claude/tools/`, dann **deine eigene Baseline in `sources.json` setzen**: führe `check.ps1 -Ack` einmal aus, nachdem du die Skills kopiert hast, damit `last_seen_commit` einen Ausgangspunkt widerspiegelt, den du selbst kontrollierst, statt der Historie des ursprünglichen Besitzers.

## Was du noch separat installieren musst

Dieses Repo enthält **Verweise auf und Regeln für** Skill-Ökosysteme — nicht die Ökosysteme selbst. Damit die CLAUDE.md-Anweisungen überhaupt etwas bedeuten, musst du installieren:

- **superpowers** (obra/superpowers) — brainstorming, writing-plans, TDD, Debugging-Skills
- **ecc / everything-claude-code** (affaan-m/ECC) — Agenten, Skills, Commands, MCP-Server
- Alle weiteren in `SKILLS_INDEX.md` genannten Plugins, die du haben möchtest

Installiere sie über das Plugin-System von Claude Code auf der neuen Maschine und gleiche dann `SKILLS_INDEX.md` mit dem ab, was du tatsächlich installiert hast.

---

## Ein Hinweis zum Abo-Plan und zur Fable-5.1-Stufe

Die Modell-Routing-Leiter in `CLAUDE.md` endet oben bei einem `fable-medium`-Subagenten — einer bewusst teuren, selten genutzten Eskalationsstufe für die schwierigsten Probleme. Der ursprüngliche Besitzer hat einen **Max**-Plan, bei dem dieses Modell verfügbar ist. Wenn du **Pro** hast (oder irgendeinen Plan ohne Fable-5.1-Zugriff), schlägt das Spawnen von `fable-medium` einfach fehl.

Bevor du `CLAUDE.md` unverändert kopierst, prüfe, welchen Plan du hast. Falls du kein Fable 5.1 hast:
- Lösche die `fable-medium`-Absätze und den „สุดบันได"-Punkt (Spitze der Leiter) aus dem Modell-Routing-Abschnitt.
- Ändere die Obergrenze der Leiter so, dass sie bei `opus` endet — die Routing-Logik (bei schwierigen/kritischen Aufgaben zu Opus eskalieren) bleibt gültig, es fehlt nur eine Stufe oberhalb von Opus, zu der weiter eskaliert werden könnte.
- Lasse `global-config/agents/fable-medium.md` aus dem weg, was du nach `~/.claude/agents/` kopierst.

`/adopt` fragt das als Teil seines Interviews ab und nimmt diese Änderung für dich vor; wenn du die Dateien stattdessen per Hand kopierst, erledige das selbst, damit Claude nicht ständig versucht, einen Subagenten zu spawnen, den dein Plan nicht erreichen kann.

---

## Optional: Lokale KI-Vorverdichtung (Ollama)

Die ursprüngliche Einrichtung nutzt lokale Ollama-Modelle als **kostenlose, verlustbehaftete Vorverdichtungsstufe** — langer, unkritischer Text (Logs, ausführliche Dokumentation) wird durch ein lokales Modell geleitet, um ihn zu verdichten, *bevor* er in den Kontext eines kostenpflichtigen Modells gelangt. Sie sitzt **unterhalb von Haiku** in der Kostenleiter und ist keine Routing-Stufe: kein Tool-Zugriff, kein Repo-Kontext, nur Text rein / Text raus. Sie spart Geld; sie fügt keine Fähigkeit hinzu. Nichts sonst in diesem Repo hängt davon ab.

**Also eine Frage, die du für dich selbst beantworten musst: willst du dafür lokale Ollama-Modelle einrichten?**

### Falls nein
Überspringe diesen gesamten Abschnitt. Lösche die Ollama-Absätze aus deiner Kopie von `CLAUDE.md` und entferne `notes/local-ollama-models.md`. Alles andere funktioniert auch ohne das einwandfrei.

### Falls ja
1. **Ollama installieren** von [ollama.com](https://ollama.com).
2. **Entscheiden, wo der Modell-Speicher liegt.** Modelle sind groß (ein 27B-Modell sind zig GB), und der Standardort liegt auf deinem Systemlaufwerk (`%USERPROFILE%\.ollama` unter Windows). Wenn dein Systemlaufwerk knapp an Platz ist, verlege den Speicher auf ein größeres Laufwerk — die ursprüngliche Einrichtung nutzte genau deshalb `D:\ollama`. Setze unter Windows die Umgebungsvariable `OLLAMA_MODELS` auf deinen gewählten Pfad, bevor du Modelle ziehst; andere Plattformen haben äquivalente Umgebungsvariablen- oder Symlink-Ansätze.
3. **Mindestens ein universelles Instruct-Modell ziehen** (z. B. `ollama pull qwen2.5:7b-instruct` oder ein ähnliches ~7–9B-Instruct-Modell — klein genug, um schnell zu laufen, gut genug zum Zusammenfassen). Das ursprüngliche Inventar in `notes/local-ollama-models.md` zeigt eine mögliche Zusammenstellung: ein großes 27B für beste Qualität, mittelgroße 7–9B-Modelle für Geschwindigkeit/Reasoning/Code, und ein bildfähiges Modell (`llava:7b`) — verstehe diese Liste als Inspiration, nicht als Einkaufsliste.
4. **Das Nutzungsmuster lernen:** eine Datei hineinleiten, eine Zusammenfassung herausbekommen —
   ```powershell
   Get-Content <file> | ollama run <model> "<instruction>"
   ```
   (Die Datei pipen; keine langen Prompts in das Argument stopfen.)
5. **Die eine feste Regel kennen:** die Ausgabe eines lokalen Modells ist **niemals gesicherte Wahrheit**. Sie ist verlustbehaftete Kompression für unkritischen Text. Wenn eine Entscheidung vom Inhalt abhängt, liest das kostenpflichtige Modell das Original — immer.

Das ist zu 100 % optional und überspringbar. Es existiert einzig, um Token-Kosten bei umfangreichem Text zu senken.

---

## Kompatibilität mit anderen KI-Coding-Tools

Diese Vorlage ist speziell für **Claude Code** gebaut. Die Mechanismen, auf denen sie beruht — eine automatisch geladene `CLAUDE.md`, das `Skill`-Tool, `settings.json`-Hooks, Subagenten-Definitionen — sind Claude-Code-Features, kein portables Dateiformat. Codex CLI, ChatGPT, Antigravity, Cursor oder ein beliebiges anderes Tool auf dieses Repo anzusetzen, lässt es nicht automatisch die Skills oder Regeln „aufnehmen"; außerhalb von Claude Code funktioniert hier nichts von selbst.

Was *von Hand* angepasst werden kann:
- `global-config/CLAUDE.md` ist reiner Text — kopiere die gewünschten Teile in eine `AGENTS.md` (die Codex CLI und einige andere Tools lesen) oder einen eigenen System-Prompt. Entferne zuerst alles, was sich auf Claude-Code-spezifische Mechanismen bezieht (spawn_task, das Skill-Tool, Subagenten-Routing) — die bedeuten anderswo nichts.
- Jeder Skill unter `global-config/skills/<name>/SKILL.md` ist einfach eine Markdown-Anweisungsdatei. Du kannst eine davon in die benutzerdefinierten Anweisungen eines anderen Tools einfügen, verlierst dabei aber die automatische Auslösung, und alle mitgelieferten Skripte setzen eine Shell voraus, die das Tool auch tatsächlich ausführen kann.
- Hooks (`settings.json`) und die Subagenten-Dateien (`agents/*.md`) sind reine Claude-Code-Funktionen — dafür gibt es keine Entsprechung zum Portieren.

Wenn du täglich mit Codex/ChatGPT/Antigravity arbeitest, ist dieses Repo trotzdem als *Referenzmaterial* nützlich (die Schreibregeln, die .docx-Fixes, die Git-Sicherheits-Hook-Logik) — erwarte aber, die relevanten Teile kopieren und einfügen zu müssen, statt den Ordner hineinzuwerfen und es funktionieren zu lassen.

---

## Vorbehalt: Das ist die Einrichtung einer einzelnen Person

Dieses Abbild stammt aus einem konkreten Workflow: einem thailändisch-englisch zweisprachigen Nutzer auf einer Windows-Maschine. Das zeigt sich überall — in den zweisprachigen Abschnitten der CLAUDE.md, in den PowerShell-vs-Bash-Fallstricken.

Übernimm, was nützlich ist, verwirf, was es nicht ist. Nichts davon ist präskriptive Best Practice — es ist das, was für eine Person funktioniert hat, gut genug aufgeschrieben, um portabel zu sein. Der eigentliche Wert liegt in der *Form* des Systems (Routing nach Kosten, Auslagern schwerer Arbeit, ein Zuhause pro Wissensstück, Sicherheitsgates bei destruktiven Befehlen), nicht in irgendeiner einzelnen Regel.
