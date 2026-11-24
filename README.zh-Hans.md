[English](README.md) | [ภาษาไทย](README.th.md) | **简体中文** | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)
<!-- abo:source-hash:a85f9d675518 -->

# Claude-Abo

Claude Code 的技能笔记本：每个技能都标明来源、许可证和状态，Claude 会根据技能的一行描述自己挑出合适的技能，无需输入任何命令。
这一行描述每次会话都会占用上下文。一条命令即可估算其 token 开销（并列出真实的 `/context` 数值），告诉你该删掉什么；目录收录了 68 个技能，每个都附有许可证、测试日期和已知问题。
`npx github:Bank848/Claude-Abo audit`  ·  [网站](https://bank848.github.io/Claude-Abo/)  ·  [目录](https://bank848.github.io/Claude-Abo/#catalog)

[![CI](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml/badge.svg)](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-68%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

## Claude 自己挑，你不用选

Claude 会读取每个技能的一行 `description`，并加载描述与你的请求相符的技能。请把这一行写成触发条件：说明何时使用该技能。

- **提示（示例）：** “为这个项目写发布帖。”
- **匹配的技能：** `english-writing-anti-ai-tell`，其描述为 "Use when drafting English-language text for the user (chat, email, essays, reports)..."
- **原因：** 发布帖是写给读者的英文文本，正是该描述所指的场景。

这是示意，不是实测。描述与任务相符，Claude 正是依据这种相符来匹配；但这不能证明仅凭描述就会触发该技能。审计会标出过长或过短、难以匹配的描述。

## 审计检查什么

完整检查清单与局限见 [docs/audit-method.md](docs/audit-method.md)(英文)。

## 使用模板

克隆仓库,在 Claude Code 中打开并运行 `/adopt`。想手动操作请看[指南](docs/guide.md)(英文)。

## Skills

完整列表见[网站目录](https://bank848.github.io/Claude-Abo/#catalog)。

## 许可证与致谢

本仓库自有内容采用 MIT,见 [LICENSE](LICENSE)。第三方 skills 的致谢见 [ATTRIBUTION.md](ATTRIBUTION.md) 和 [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)。

## 说明:这是一个人的配置

本仓库来自一位泰语用户在 Windows 上的工作流,因此带有泰语和 PowerShell 的痕迹。只取对你有用的部分,并按自己的情况调整。
