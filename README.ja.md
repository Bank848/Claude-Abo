[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | **日本語** | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)
<!-- abo:source-hash:a85f9d675518 -->

# Claude-Abo

Claude Code のスキルノート: 各スキルに出典・ライセンス・状態を記し、Claude がスキルの 1 行の説明から適切なスキルを自分で選ぶので、コマンドを打つ必要はありません。
その 1 行はセッションごとにコンテキストを消費します。コマンド 1 つでそのコストをトークン数で見積もり（実際の `/context` の値と並べて表示）、削る候補を挙げます。カタログには 68 個のスキルがあり、それぞれにライセンス、テスト日、既知の問題が付いています。
`npx github:Bank848/Claude-Abo audit`  ·  [サイト](https://bank848.github.io/Claude-Abo/)  ·  [カタログ](https://bank848.github.io/Claude-Abo/#catalog)

[![CI](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml/badge.svg)](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-68%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

## Claude が選ぶので、選ばなくて済む

Claude は各スキルの 1 行の `description` を読み、依頼に合う説明を持つスキルを読み込みます。この行は、いつ使うかを書いたトリガーとして書いてください。

- **プロンプト（例）:** 「このプロジェクトの公開告知の文章を書いて」
- **合致するスキル:** `english-writing-anti-ai-tell`。説明は "Use when drafting English-language text for the user (chat, email, essays, reports)..."
- **理由:** 告知文は読者に向けた英文であり、説明が指している場面そのものだからです。

これは計測ではなく例示です。説明がタスクに合っていることが、Claude が照合する根拠ですが、説明だけでスキルが起動することの証明にはなりません。audit は、長すぎる説明や短すぎて照合できない説明を警告します。

## 監査で調べること

チェック項目と制限は [docs/audit-method.md](docs/audit-method.md)(英語)を参照してください。

## テンプレートの使い方

リポジトリをクローンし、Claude Code で開いて `/adopt` を実行します。手作業で行う場合は[ガイド](docs/guide.md)(英語)を参照してください。

## Skills

全一覧は[サイトのカタログ](https://bank848.github.io/Claude-Abo/#catalog)にあります。

## ライセンスとクレジット

このリポジトリ自体の内容は MIT です([LICENSE](LICENSE))。他の人の skills のクレジットは [ATTRIBUTION.md](ATTRIBUTION.md) と [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) にあります。

## 注意: これは一人の設定です

このリポジトリは、Windows を使うタイ語ユーザーの作業環境から生まれたため、タイ語や PowerShell の跡が残っています。使えるところだけ取り入れ、自分向けに調整してください。
