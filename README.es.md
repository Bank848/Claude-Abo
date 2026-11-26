[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | **Español** | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)
<!-- abo:source-hash:a85f9d675518 -->

# Claude-Abo

Un cuaderno de skills para Claude Code: cada skill aparece con su origen, licencia y estado, y Claude elige por sí mismo la adecuada a partir de la descripción de una línea de la skill, sin escribir ningún comando.
Esa línea también cuesta contexto en cada sesión. Un comando estima el coste en tokens (junto a la cifra real de `/context`) y lista qué recortar; el catálogo tiene 68 skills con licencia, fecha de prueba y problemas conocidos de cada una.
`npx github:Bank848/Claude-Abo audit`  ·  [Sitio](https://bank848.github.io/Claude-Abo/)  ·  [Catálogo](https://bank848.github.io/Claude-Abo/#catalog)

[![CI](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml/badge.svg)](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-68%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

## Claude elige, tú no

Claude lee la `description` de una línea de cada skill y carga la skill cuya descripción encaja con tu petición. Escribe esa línea como un disparador: di cuándo usar la skill.

- **Prompt (ilustrativo):** "Escribe el post de lanzamiento de este proyecto."
- **Skill que encaja:** `english-writing-anti-ai-tell`, descrita como "Use when drafting English-language text for the user (chat, email, essays, reports)..."
- **Por qué:** el post es texto en inglés escrito para lectores, que es lo que nombra la descripción.

Es una ilustración, no una medición. La descripción encaja con la tarea, y ese encaje es lo que Claude usa para elegir; no prueba que la descripción sola active la skill. La auditoría marca las descripciones demasiado largas o demasiado cortas para coincidir.

## Qué revisa la auditoría

La lista completa y sus límites están en [docs/audit-method.md](docs/audit-method.md) (en inglés).

## Usar la plantilla

Clona el repositorio, ábrelo en Claude Code y ejecuta `/adopt`. Si prefieres hacerlo a mano, mira la [guía](docs/guide.md) (en inglés).

## Skills

La lista completa está en el [catálogo del sitio](https://bank848.github.io/Claude-Abo/#catalog).

## Licencia y créditos

El contenido propio de este repositorio es MIT: ver [LICENSE](LICENSE). Los créditos de las skills de terceros están en [ATTRIBUTION.md](ATTRIBUTION.md) y [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## Aviso: es la configuración de una persona

Este repositorio nace del flujo de trabajo de un usuario tailandés en Windows, y se nota en el tailandés y en PowerShell. Toma lo útil y adáptalo a tu caso.
