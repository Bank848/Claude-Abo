[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | **Português (Brasil)** | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)
<!-- abo:source-hash:71b757078bf5 -->

# Claude-Abo

Um caderno de skills para o Claude Code: cada skill aparece com origem, licença e status, e o Claude escolhe sozinho a certa pela descrição de uma linha da skill, sem nenhum comando para digitar.
Essa linha também custa contexto a cada sessão. Um comando estima o custo em tokens (ao lado do valor real de `/context`) e lista o que cortar; o catálogo tem 68 skills com licença, data de teste e problemas conhecidos de cada uma.
`npx github:Bank848/Claude-Abo audit`  ·  [Site](https://bank848.github.io/Claude-Abo/)  ·  [Catálogo](https://bank848.github.io/Claude-Abo/#catalog)

[![CI](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml/badge.svg)](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-68%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

## O Claude escolhe, você não

O Claude lê a `description` de uma linha de cada skill e carrega a skill cuja descrição combina com o seu pedido. Escreva essa linha como um gatilho: diga quando usar a skill.

- **Prompt (parafraseado):** "Escreva o post de lançamento deste projeto."
- **Skill que foi acionada:** `english-writing-anti-ai-tell`, descrita como "Use when drafting English-language text for the user (chat, email, essays, reports)..."
- **Por quê:** o post é texto em inglês escrito para leitores, que é o que a descrição nomeia.

Visto uma única vez, numa sessão com a configuração do mantenedor, em que uma regra do CLAUDE.md também cita essa skill. Isso mostra que a descrição combina com a tarefa; não prova que só a descrição a aciona. A auditoria sinaliza descrições longas ou curtas demais para casar.

## O que a auditoria verifica

A lista completa e os limites estão em [docs/audit-method.md](docs/audit-method.md) (em inglês).

## Usar o modelo

Clone o repositório, abra no Claude Code e execute `/adopt`. Para fazer manualmente, veja o [guia](docs/guide.md) (em inglês).

## Skills

A lista completa está no [catálogo do site](https://bank848.github.io/Claude-Abo/#catalog).

## Licença e créditos

O conteúdo próprio deste repositório é MIT: veja [LICENSE](LICENSE). Os créditos das skills de terceiros estão em [ATTRIBUTION.md](ATTRIBUTION.md) e [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## Aviso: é a configuração de uma pessoa

Este repositório vem do fluxo de trabalho de um usuário tailandês no Windows, e isso aparece no tailandês e no PowerShell. Use o que servir e adapte ao seu caso.
