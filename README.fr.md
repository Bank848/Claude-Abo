[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | **Français** | [Deutsch](README.de.md) | [Русский](README.ru.md)
<!-- abo:source-hash:71b757078bf5 -->

# Claude-Abo

Un carnet de skills pour Claude Code : chaque skill est listée avec sa source, sa licence et son statut, et Claude choisit lui-même la bonne à partir de la description d'une ligne de la skill, sans commande à taper.
Cette ligne coûte aussi du contexte à chaque session. Une commande estime ce coût en tokens (à côté du chiffre réel de `/context`) et liste ce qu'il faut couper ; le catalogue compte 68 skills avec licence, date de test et problèmes connus pour chacune.
`npx github:Bank848/Claude-Abo audit`  ·  [Site](https://bank848.github.io/Claude-Abo/)  ·  [Catalogue](https://bank848.github.io/Claude-Abo/#catalog)

[![CI](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml/badge.svg)](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-68%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

## Claude choisit, pas vous

Claude lit la `description` d'une ligne de chaque skill et charge celle dont la description correspond à votre demande. Écrivez cette ligne comme un déclencheur : dites quand utiliser la skill.

- **Prompt (reformulé) :** « Écris le post de lancement de ce projet. »
- **Skill déclenchée :** `english-writing-anti-ai-tell`, décrite par "Use when drafting English-language text for the user (chat, email, essays, reports)..."
- **Pourquoi :** le post est un texte anglais écrit pour des lecteurs, ce que nomme la description.

Observé une seule fois, dans une session sur la configuration du mainteneur, où une règle de CLAUDE.md nomme aussi cette skill. Cela montre que la description correspond à la tâche ; cela ne prouve pas que la description seule la déclenche. L'audit signale les descriptions trop longues ou trop courtes pour correspondre.

## Ce que vérifie l'audit

La liste complète et ses limites se trouvent dans [docs/audit-method.md](docs/audit-method.md) (en anglais).

## Utiliser le modèle

Clonez le dépôt, ouvrez-le dans Claude Code et lancez `/adopt`. Pour le faire à la main, voyez le [guide](docs/guide.md) (en anglais).

## Skills

La liste complète est dans le [catalogue du site](https://bank848.github.io/Claude-Abo/#catalog).

## Licence et crédits

Le contenu propre à ce dépôt est sous licence MIT : voir [LICENSE](LICENSE). Les crédits des skills tierces sont dans [ATTRIBUTION.md](ATTRIBUTION.md) et [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## Avertissement : la configuration d'une seule personne

Ce dépôt vient du flux de travail d'un utilisateur thaïlandais sous Windows, ce qui se voit dans le thaï et PowerShell. Prenez ce qui vous sert et adaptez-le.
