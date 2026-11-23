[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | **日本語** | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)
<!-- abo:source-hash:8de5a318aa81 -->

# Claude-Abo

Claude Code の設定がセッションごとにどれだけコンテキストを使うか、そして `git push --force` を止められるかを調べます。
1 つのコマンドで、設定が常に消費するコンテキストをトークン数で見積もり(実際の `/context` の値と並べて表示)、削るべきものを一覧にします。カタログには <!-- gen:skills-count:start -->61<!-- gen:skills-count:end --> 個の skills があり、それぞれにライセンス、テスト日、既知の問題が付いています。
`npx github:Bank848/Claude-Abo audit`  ·  [サイト](https://bank848.github.io/Claude-Abo/)  ·  [カタログ](https://bank848.github.io/Claude-Abo/#catalog)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-61%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

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
