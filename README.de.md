[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | **Deutsch** | [Русский](README.ru.md)
<!-- abo:source-hash:a85f9d675518 -->

# Claude-Abo

Ein Skill-Notizbuch für Claude Code: Jeder Skill ist mit Quelle, Lizenz und Status aufgeführt, und Claude wählt den passenden Skill anhand seiner einzeiligen Beschreibung selbst aus, ganz ohne Befehl.
Diese Zeile kostet bei jeder Sitzung auch Kontext. Ein Befehl schätzt die Kosten in Tokens (neben dem echten `/context`-Wert) und listet, was sich kürzen lässt; der Katalog enthält 68 Skills mit Lizenz, Testdatum und bekannten Problemen.
`npx github:Bank848/Claude-Abo audit`  ·  [Website](https://bank848.github.io/Claude-Abo/)  ·  [Katalog](https://bank848.github.io/Claude-Abo/#catalog)

[![CI](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml/badge.svg)](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-68%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

## Claude wählt, du nicht

Claude liest die einzeilige `description` jedes Skills und lädt den Skill, dessen Beschreibung zu deiner Anfrage passt. Schreibe diese Zeile als Auslöser: Sag, wann der Skill zu verwenden ist.

- **Prompt (zur Veranschaulichung):** "Schreib den Launch-Post für dieses Projekt."
- **Passender Skill:** `english-writing-anti-ai-tell`, beschrieben als "Use when drafting English-language text for the user (chat, email, essays, reports)..."
- **Warum:** Der Post ist englischer Text für Leser, und genau das nennt die Beschreibung.

Das ist eine Veranschaulichung, keine Messung. Die Beschreibung passt zur Aufgabe, und diese Passung nutzt Claude zur Auswahl; es beweist nicht, dass die Beschreibung allein den Skill auslöst. Das Audit markiert Beschreibungen, die zu lang oder zu kurz zum Zuordnen sind.

## Was das Audit prüft

Die vollständige Liste und ihre Grenzen stehen in [docs/audit-method.md](docs/audit-method.md) (auf Englisch).

## Die Vorlage nutzen

Repository klonen, in Claude Code öffnen und `/adopt` ausführen. Wer es von Hand machen will, findet den [Leitfaden](docs/guide.md) (auf Englisch).

## Skills

Die vollständige Liste steht im [Katalog der Website](https://bank848.github.io/Claude-Abo/#catalog).

## Lizenz und Danksagung

Der eigene Inhalt dieses Repositories steht unter MIT: siehe [LICENSE](LICENSE). Die Danksagungen für Skills anderer stehen in [ATTRIBUTION.md](ATTRIBUTION.md) und [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## Hinweis: das Setup einer einzelnen Person

Dieses Repository stammt aus dem Arbeitsablauf eines thailändischen Nutzers unter Windows, was man an Thai und PowerShell merkt. Nimm, was nützt, und passe es an.
