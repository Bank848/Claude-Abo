[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | **Русский**
<!-- abo:source-hash:8a9163bf32af -->

# Claude-Abo

Узнайте, сколько контекста съедает ваша настройка Claude Code в каждой сессии и останавливает ли она `git push --force`.
Одна команда оценивает постоянный контекст вашей настройки в токенах (рядом с реальным значением из `/context`) и перечисляет, что можно убрать; в каталоге <!-- gen:skills-count:start -->68<!-- gen:skills-count:end --> skills, у каждого есть лицензия, дата проверки и известные проблемы.
`npx github:Bank848/Claude-Abo audit`  ·  [Сайт](https://bank848.github.io/Claude-Abo/)  ·  [Каталог](https://bank848.github.io/Claude-Abo/#catalog)

[![CI](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml/badge.svg)](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-68%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

## Что проверяет аудит

Полный список и ограничения описаны в [docs/audit-method.md](docs/audit-method.md) (на английском).

## Как пользоваться шаблоном

Клонируйте репозиторий, откройте его в Claude Code и выполните `/adopt`. Для ручной настройки см. [руководство](docs/guide.md) (на английском).

## Skills

Полный список находится в [каталоге на сайте](https://bank848.github.io/Claude-Abo/#catalog).

## Лицензия и благодарности

Собственное содержимое репозитория распространяется по MIT: см. [LICENSE](LICENSE). Благодарности авторам чужих skills находятся в [ATTRIBUTION.md](ATTRIBUTION.md) и [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## Оговорка: это настройка одного человека

Репозиторий вырос из рабочего процесса тайскоязычного пользователя Windows, поэтому в нём остались тайский язык и PowerShell. Берите нужное и адаптируйте под себя.
