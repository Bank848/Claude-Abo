[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | **한국어** | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)
<!-- abo:source-hash:71b757078bf5 -->

# Claude-Abo

Claude Code용 스킬 노트: 각 스킬에 출처, 라이선스, 상태를 적어 두면 Claude가 스킬의 한 줄 설명을 보고 알맞은 스킬을 스스로 고르므로 명령을 입력할 필요가 없습니다.
그 한 줄은 세션마다 컨텍스트를 차지합니다. 명령 하나로 그 비용을 토큰으로 추정하고(실제 `/context` 수치와 나란히 표시) 무엇을 줄일지 알려 줍니다. 카탈로그에는 스킬 68개가 있고, 각각 라이선스, 테스트 날짜, 알려진 문제가 붙어 있습니다.
`npx github:Bank848/Claude-Abo audit`  ·  [사이트](https://bank848.github.io/Claude-Abo/)  ·  [카탈로그](https://bank848.github.io/Claude-Abo/#catalog)

[![CI](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml/badge.svg)](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-68%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

## Claude가 고르니, 직접 고르지 않아도 됩니다

Claude는 각 스킬의 한 줄 `description`을 읽고, 요청과 맞는 설명을 가진 스킬을 불러옵니다. 그 줄은 언제 쓰는지 적은 트리거로 쓰세요.

- **프롬프트(요약):** "이 프로젝트의 출시 글을 써 줘."
- **작동한 스킬:** `english-writing-anti-ai-tell`, 설명은 "Use when drafting English-language text for the user (chat, email, essays, reports)..."
- **이유:** 출시 글은 독자를 위해 쓰는 영어 텍스트이고, 설명이 가리키는 상황이 바로 그것입니다.

관리자의 환경에서 한 번 관찰한 결과이며, 그곳에는 CLAUDE.md 규칙도 이 스킬을 지목하고 있습니다. 설명이 작업과 맞는다는 것은 보여 주지만, 설명만으로 작동한다는 증거는 아닙니다. audit은 너무 길거나 너무 짧아 매칭하기 어려운 설명을 표시합니다.

## 감사가 확인하는 것

전체 점검 목록과 한계는 [docs/audit-method.md](docs/audit-method.md)(영어)를 보세요.

## 템플릿 사용하기

저장소를 클론하고 Claude Code에서 열어 `/adopt`를 실행하세요. 직접 하려면 [가이드](docs/guide.md)(영어)를 보세요.

## Skills

전체 목록은 [사이트 카탈로그](https://bank848.github.io/Claude-Abo/#catalog)에 있습니다.

## 라이선스와 크레딧

이 저장소의 자체 콘텐츠는 MIT입니다: [LICENSE](LICENSE). 다른 사람의 skills 크레딧은 [ATTRIBUTION.md](ATTRIBUTION.md)와 [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)에 있습니다.

## 주의: 한 사람의 설정입니다

이 저장소는 Windows를 쓰는 태국어 사용자의 작업 방식에서 나와서 태국어와 PowerShell의 흔적이 남아 있습니다. 쓸 만한 부분만 가져가 자신에게 맞게 고치세요.
