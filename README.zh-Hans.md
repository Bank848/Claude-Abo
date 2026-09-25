[English](README.md) | [ภาษาไทย](README.th.md) | **简体中文** | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Claude%20Code%20Clone%20Template&fontSize=38&fontColor=ffffff&fontAlignY=38&desc=A%20portable%20snapshot%20of%20one%20person's%20Claude%20Code%20setup&descAlignY=58&descSize=17&descColor=ffffff&animation=fadeIn" alt="Claude Code Clone Template banner" width="100%"/>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-45%20curated-brightgreen)](#global-configskills)
[![Languages](https://img.shields.io/badge/languages-10-orange)](#top)
[![Template](https://img.shields.io/badge/type-adapt%2C%20not%20run%20as--is-lightgrey)](#caveat-this-is-one-persons-setup)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=17&pause=1200&color=6C63FF&center=true&vCenter=true&width=640&lines=45+curated+skills+with+full+provenance;Cost-aware+Sonnet+%2F+Opus+%2F+Haiku+model+routing;Git+safety+hooks+%2B+%2Fplan-pro+workflow;Cross-project+second-brain+vault" alt="rotating feature highlights"/>

</div>

这是一份来自某位开发者的 Claude Code 配置快照——包含全局指令、工程规范、**45 个精选 skill**(其中 7 个为原创:3 个从零写成,4 个是围绕第三方工具自写的封装;1 个由上游 skill 改编而来;其余均采纳自上游仓库,每个 skill 的来源都记录在 `sources.json` 中)、真实的 memory 示例、一份 skill 溯源清单,以及一个跨项目知识库——把这些打包在一起,是为了让一个全新的 Claude Code 实例(或负责搭建它的人)能在新机器上复刻同一套工作流习惯与能力。这是一份**用来参考改造、而非照搬即用的模板**:个人身份信息已被清除并替换为占位符,其中一些章节也只有在你同时采用了它们所描述的工具后才有意义。

## 快速上手(Quickstart)

**捷径:** 克隆仓库,在 Claude Code 中打开,运行 `/adopt`——它会通过对话询问你(想要哪些可选部分、插件列表、目标路径),并自动帮你完成下面第 2-6 步和第 8-9 步,过程中会在一个可恢复的日志文件里记录进度。第 7 步(安装插件生态本身)特意被排除在 `/adopt` 的范围之外——这一步仍需要你自己动手。下面的手动步骤正是 `/adopt` 自动化的内容,同时也留给那些想手动操作、或想在运行前先确认改动内容的人。

1. **克隆仓库**到目标机器上任意方便的位置。
2. **现在就决定那唯一的可选项**——回答是/否,这会决定你在第 5 步要删除什么:本地 AI(Ollama)预压缩。详见下方"可选:___"章节。
3. **将 `global-config/CLAUDE.md`、`agents/*.md`、`hooks/block-dangerous-git.py`、`skills/*` 和 `tools/`** 复制到你自己的 `~/.claude/`(合并还是覆盖由你决定)。正是这些文件让路由规则、git 安全网关、skill 目录和更新检查器真正生效,而不只是停留在文字说明层面。**在复制 `CLAUDE.md` 之前,先重写其中"Installed Plugins"一节,使其只列出你实际安装的插件**——原作者的版本声明了特定插件已启用;原样照搬会让你的 Claude 对可用工具撒谎。
4. **将 `global-config/settings.example.json` 合并**进你的 `~/.claude/settings.json`(先替换掉 `<YOUR_HOME>`;macOS/Linux 上还需把 hook 命令里的 `py` 启动器改成 `python3`,这一项是 Windows 专用的)。
5. **如果第 2 步回答"否",删除 Ollama。** 快速做法:删除你 CLAUDE.md 副本里的 Ollama 段落、`notes/local-ollama-models.md`,以及 `tools/ollama/`。
6. **对保留下来的所有内容做查找替换**,替换占位符——完整清单见下方"如何采用本仓库"第 8 步。
7. **安装所引用的插件生态**(superpowers、ecc 等)——详见下方"你还需要单独安装的东西"。
8. **可选择把 `notes/`** 复制进你自己的第二大脑知识库位置,并把 **`memory-examples/`** 复制进对应项目的 Claude Code auto-memory 文件夹。
9. **启动一个 Claude Code 会话并验证**新的 CLAUDE.md 已被识别——例如让它写一份实现计划,看是否会调用 `/plan-pro`;或者问它模型路由策略,看它是否能说出那套成本阶梯。

本 README 的其余部分会详细解释每一部分内容。

## 仓库内容

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
整套配置的核心,它规定了:

- **成本感知的模型路由** ——主循环用 Sonnet 担任协调者,根据任务难度把工作委派给 Haiku/Opus/Fable 子代理,并附有"谁读原始文件、谁只读结论"的硬性规则。
- **重型任务的外部执行** ——把大任务分派到独立会话中,而不是让当前会话越滚越大(账单也跟着涨)。
- **规划工作流** ——`/plan-pro` 作为默认的计划撰写工具。
- **第二大脑知识库的组织约定** ——一条规则("是否绑定到某个仓库?")就决定了内容应该放进知识库还是某个仓库的 docs/ADR。
- **Git 安全 hook** ——一个在执行破坏性 git 命令前弹出确认的 PreToolUse 网关。
- **Shell 使用陷阱** ——Bash 工具与 PowerShell 工具在 heredoc 语法上的差异规则(Windows 特有的坑,踩过才知道)。
- **上下文自我监控** ——Claude 何时应该主动建议 `/compact`。
- **反 AI 腔写作规则** ——一整套泰语+英语规则集,让草拟的文本读起来像人写的(要避免的词汇、结构模式、语域匹配);这是该文件里体量最大、最具普适性的一部分。背景细节保存在 `memory-examples/` 中。
- **PR 默认先开 draft**、**创建定时/云端代理前先询问**、**长时间运行命令期间的简洁叙述原则**、面向并行会话的 **claude-in-chrome 共享标签组陷阱**,以及针对任何使用 Supabase 的项目的**主动 RLS 安全检查**。

### `global-config/rules/ecc-common/`
来自 ecc(everything-claude-code)插件生态的通用工程规范:TDD 工作流、不可变性原则、提交信息格式、安全检查清单、代码评审严重级别、代理委派规则。只有在你也运行 ecc 时才有用(见下方"你还需要单独安装"章节)。

### `global-config/skills/`
45 个精选的 `SKILL.md` 文件夹(部分 skill 还附带脚本/参考资料/数据文件),覆盖写作与营销技巧(copywriting、copy-editing、hallmark、marketing-council、pricing……)、工程流程(debug-mantra、poka-yoke、second-brain、dependency-audit、secrets-audit……)、设计(design-system、ui-ux-pro-max、banner-design、mobbin-references……),以及用于管理 Claude Code 自身的元技能(skillify、grilling、second-brain、graphify、plan-pro、shipping-a-branch……)。其中 `poka-yoke`、`plan-pro`、`shipping-a-branch` 是从零原创;`graphify`、`dembrandt`、`markitdown`、`mobbin-references` 是自写的封装 skill——SKILL.md 是原创内容,但底层工具来自第三方(致谢见 `ATTRIBUTION.md`,版本追踪见 `sources.json`);`deslop-defaults` 属于改编(取材自 `ibelick/ui-skills` 并改写为技术栈无关版本);其余均采纳自上游仓库——每个 skill 的具体来源见 `sources.json`,上游致谢见 `ATTRIBUTION.md`。这些都是真正可复用的 prompt 工程成果,而不只是对 skill 的文字描述——把它们复制进 `~/.claude/skills/` 就能立即生效。

<details>
<summary><b>查看全部 45 个 skill(按类别分组)</b>(点击展开)</summary>

**工程流程与工作流(15)**

| Skill | 功能说明 |
|---|---|
| `debug-mantra` | 四步调试准则(复现 → 追踪 → 证伪 → 交叉验证),在提出任何修复方案前先诵读一遍。 |
| `poka-yoke` *(原创)* | 防呆式评审——让错误状态在源头就变得不可能发生或一眼可见,而不是事后才去抓。 |
| `post-mortem` | 在 bug 被修复并验证后,撰写标准的根因分析报告。 |
| `scrutinize` | 以局外人视角评审计划/PR/diff——先审视意图,再追踪真实的代码路径。 |
| `shipping-a-branch` *(原创)* | 端到端驱动"提交 → 推送 → 开 PR → 评审 → 合并"流程,每一步高风险操作都单独确认。 |
| `plan-pro` *(原创)* | 实现计划撰写工具,带有多代理评审循环和 HTML 前后对比输出。 |
| `dependency-audit` | 检查项目依赖是否存在已知 CVE 和供应链风险。 |
| `secrets-audit` | 扫描源代码、git 历史和基础设施,查找泄露的凭据和薄弱的密钥管理实践。 |
| `prompt-injection` | 审计应用/代理是否存在 prompt injection 漏洞及 LLM 权限边界问题。 |
| `decide` | 结构化决策流程(37signals 风格的问题清单),并归档决策理由。 |
| `unstuck` | 横向思维技巧库,用于突破卡壳点,而不是直接回复"做不到"。 |
| `teach` | 在当前工作环境中,向用户讲解一个新概念或技能。 |
| `wait-what` | 标记出没有被理解到位的消息,并重新表达一遍。 |
| `skillify` | 创建、改编或更新一个 Claude Code skill(来源可以是对话、视频、资料转储或外部仓库)。 |
| `wizard` | 为只能由人工完成的步骤(凭据、控制台操作、迁移等)生成一个交互式 bash 向导。 |

**设计与 UI(11)**

| Skill | 功能说明 |
|---|---|
| `banner-design` | 跨多种美术风格设计社交/广告/网页/印刷 banner。 |
| `design` | 综合设计 skill——logo、CIP 视觉规范、幻灯片、banner、图标、社交配图。 |
| `design-system` | 三层设计令牌架构(基础层 → 语义层 → 组件层),外加幻灯片生成。 |
| `deslop-defaults` *(改编)* | 一套结构性默认规则,避免 AI 生成的 UI 显得平庸(z-index、强调色克制、状态处理)。 |
| `hallmark` | 面向从零设计、重新设计以及从 URL/截图提取设计的反 AI 套路设计 skill。 |
| `ui-styling` | 用 shadcn/ui、Tailwind 和暗色模式感知的主题构建无障碍 UI。 |
| `ui-ux-pro-max` | 可检索的 UI/UX 数据库——风格、配色方案、字体搭配、UX 准则、动效预设、图表类型。 |
| `mobbin-references` | 在设计 UI 之前,拉取真实 App 的参考截图(引导流程、付费墙、空状态等)。 |
| `dembrandt` *(封装)* | 通过 DOM/CSS 检查,提取某个真实网站实际使用的设计令牌(颜色、字体、间距)。 |
| `image` | 生成/编辑/优化营销图像(主视觉图、社交配图、产品效果图、OG 图片)。 |
| `slides` | 用 Chart.js 和设计令牌主题构建策略型 HTML 演示文稿。 |

**营销、内容与品牌(13)**

| Skill | 功能说明 |
|---|---|
| `brand` | 品牌语调、视觉识别、信息传达框架及一致性检查。 |
| `community-marketing` | 社区驱动的增长策略(Discord/Slack/论坛、大使计划、拥护者运营)。 |
| `content-strategy` | 决定要创作什么内容——主题集群、编辑日历、内容支柱。 |
| `copy-editing` | 编辑、精简、刷新现有营销文案。 |
| `copywriting` | 为落地页/定价页/功能页/关于页撰写新的营销文案。 |
| `launch` | 规划产品发布、功能公告或上市清单。 |
| `management-talk` | 把工程师之间的沟通改写成适合管理层的表达,并根据目标渠道(Slack/邮件/站会)调整。 |
| `marketing-council` | 模拟一个由多位知名营销人组成的顾问团,围绕定位问题展开辩论。 |
| `marketing-ideas` | 面向 SaaS 与软件产品的增长/营销点子生成器。 |
| `marketing-psychology` | 将行为科学原理(锚定、社会认同、框架效应)应用到营销决策中。 |
| `pricing` | 定价/套餐策略以及定价页审计。 |
| `product-marketing` | 构建其他营销 skill 会引用的、可复用的产品/受众/定位背景文档。 |
| `social` | 跨平台的社交内容创作、排期、二次利用与社交聆听。 |

**研究与知识管理(6)**

| Skill | 功能说明 |
|---|---|
| `deep-research` | 多来源、多轮次的研究简报,附引用、矛盾点和信息缺口。 |
| `graphify` *(封装,原创)* | 把任意输入(代码/文档/论文/图像)转换为带聚类和审计报告的知识图谱。 |
| `grilling` | 在动手构建之前,持续追问用户,对计划做压力测试。 |
| `second-brain` | 面向个人 Obsidian 风格知识库的捕获/整理/查询/校验/关联工作流。 |
| `watch-video` | 从任意 yt-dlp 支持的视频源提取文字稿/视觉/多模态内容。 |
| `markitdown` *(封装)* | 将 PDF/幻灯片/表格/音频/HTML 等转换为适合 LLM/RAG 使用的干净 Markdown。 |

每个条目完整的溯源信息(来源仓库、采纳日期、原创 vs. 采纳 vs. 改编)都在 `global-config/tools/skill-update-check/sources.json` 中;上游致谢见 `ATTRIBUTION.md`。

</details>

### `global-config/memory-examples/`
来自原作者 Claude Code auto-memory 系统的 7 条真实条目(并非项目相关的具体事实,而是可移植的"我的工作方式"习惯):一条跨会话消息命名歧义的澄清、"本地 Ollama 作为预压缩层"的模式、一条关于"更新 skill 笔记本"实际操作含义的规则、一个 shell 转义的坑(`\b` 会被悄悄转成退格字节)、一条关于清理上下文膨胀应该多激进的反馈条目,以及 CLAUDE.md 中反 AI 腔写作规则的完整背景资料(词汇表+前后对比示例,中泰英双语版本对应为泰语和英语)。这些条目的意义更多在于展示一条好的 memory 条目应有的*形态*(规则 + 原因 + 应用方法),而不只是具体内容本身——关于 memory 如何融入更大的工作流,可参考 `global-config/rules/ecc-common/`;关于本地记忆与全局记忆的区分方式,可参考 CLAUDE.md 中的"จำ/บัญญัติ"一节。

### `global-config/tools/skill-update-check/sources.json`
原作者真实的 skill/工具采纳清单——包含全部 45 个个人 skill(含原创和改编的)以及 3 个 pip 包、2 个 npm 包、1 个二进制工具的真实溯源数据(来源仓库 URL、安装备注、版本历史)。配合 `check.ps1` 使用,这套机制能让 `claude-clone-template` 的使用者像原作者一样,追踪自己复制到 `~/.claude/skills/` 中的 skill 在上游的更新情况。对接收者而言,`last_seen_commit` 的值大多是 `unknown` 或过期状态,直到运行一次 `check.ps1 -Ack` 建立起自己的基线为止。

### `global-config/templates/`
两个用于新仓库初始配置的小型起始文件(`project-CLAUDE.md`、`conventions.md`)——一份不超过 45 行的"路由型"项目 CLAUDE.md,以及一份约定/绿灯门槛模板。每个文件都带有注释块,提供了针对特定技术栈的填空式 PRESET(目前只有一个 Python-web 示例);如果你的技术栈需要,可以用同样的方式添加自己的 preset。

### `notes/`
来自原作者 Obsidian 第二大脑知识库的示例内容:本地 Ollama 模型清单、收藏的仓库、以及各种参考笔记。这些内容展示的是"跨项目知识库里应该放什么类型的东西",而不是放之四海皆准的必备项。保留这种结构思路即可,内容可以随时间替换成你自己的。

## 如何采用本仓库

1. **复制 `global-config/CLAUDE.md`** 到你自己的 `~/.claude/CLAUDE.md`。可以与你现有的内容合并,也可以直接替换——由你决定。先通读一遍,删掉不适用于你的部分。**在做任何其他操作之前,先重写"Installed Plugins"一节**——它目前声明了特定插件(superpowers、ecc、pordee、lazyweb、andrej-karpathy-skills)已安装并启用,并且告诉 Claude 不要提及安装这些插件。这对原作者是事实,对你未必是。把它替换成你自己实际的插件列表,或者在你安装好东西之前先删掉这部分。
2. **将 `global-config/agents/*.md`** 复制到 `~/.claude/agents/`,并把 **`global-config/hooks/block-dangerous-git.py`** 复制到 `~/.claude/hooks/`。正是这些文件让 CLAUDE.md 里的模型路由规则和 git 安全网关真正起作用,而不只是文字说明。
3. **将 `global-config/skills/*`** 复制到 `~/.claude/skills/`。这是本仓库实际价值的主体——45 个可直接使用的 skill 文件夹,而不只是对它们的描述。
4. **将 `global-config/settings.example.json` 合并**进你自己的 `~/.claude/settings.json`(先把 `<YOUR_HOME>` 替换成你真实的家目录路径)。如果你已经有一份 settings.json,应该合并而不是覆盖——取 `hooks.PreToolUse` 条目以及 `enabledPlugins` 中你想要的部分。shipped 的 hook 命令用的是 Windows 的 `py` 启动器;在 macOS/Linux 上,先把它改成 `python3`。
5. **将 `global-config/rules/ecc-common/` 复制**到 `~/.claude/rules/`,**仅当**你安装了 ecc 插件时才这么做,否则跳过。
6. **将 `global-config/memory-examples/*.md` 复制**到你希望它们生效的那个项目对应的 auto-memory 文件夹中(Claude Code 的 auto-memory 是按项目划分的,位于 `~/.claude/projects/<project>/memory/`),或者只是把它们当作参考读一遍,自己从零写一份。
7. **将 `notes/` 复制**到你自己的第二大脑知识库位置(任何 Obsidian 或纯 markdown 工具能看到的文件夹都行),如果不需要知识库可以完全跳过。
8. **对每一个占位符做查找替换**——这是最重要的一步:
   - `<YOUR_USERNAME>`、`<YOUR_HOME>` → 你实际的 Windows/系统用户名和家目录路径
   - `<YOUR_VAULT_PATH>` → 你存放(或打算存放)第二大脑知识库的位置
9. **将 `global-config/tools/`**(包括 `skill-update-check/`,以及如果你保留了 Ollama 的话还有 `ollama/`)复制到 `~/.claude/tools/`,然后**在 `sources.json` 中建立你自己的基线**:把 skill 复制过去之后运行一次 `check.ps1 -Ack`,让 `last_seen_commit` 反映出属于你自己的起点,而不是原作者的历史记录。

## 你还需要单独安装的东西

本仓库包含的是对各类 skill 生态的**引用和相关规则**,并不包含这些生态本身。要让 CLAUDE.md 里的指令真正发挥作用,你还需要安装:

- **superpowers**(obra/superpowers)——brainstorming、writing-plans、TDD、调试相关 skill
- **ecc / everything-claude-code**(affaan-m/ECC)——代理、skill、命令、MCP 服务器
- `SKILLS_INDEX.md` 中提到的、你觉得需要的其他插件

在新机器上通过 Claude Code 的插件系统安装它们,然后把 `SKILLS_INDEX.md` 与你实际安装的内容对齐。

---

## 关于订阅套餐与 Fable 5.1 层级的说明

`CLAUDE.md` 里的模型路由阶梯最顶层是 `fable-medium` 子代理——这是一个刻意设置得很昂贵、极少使用的升级层级,专门留给最棘手的问题。原作者使用的是 **Max** 套餐,才能用上这个模型。如果你用的是 **Pro** 套餐(或任何没有 Fable 5.1 访问权限的套餐),调用 `fable-medium` 只会失败。

在原样复制 `CLAUDE.md` 之前,先确认你自己的套餐等级。如果你没有 Fable 5.1:
- 删除模型路由部分里关于 `fable-medium` 的段落,以及"สุดบันได"(阶梯顶层)那一条。
- 把阶梯的顶层改为止于 `opus`——路由逻辑(在困难/高风险任务上升级到 Opus)依然成立,只是不再有比 Opus 更高的层级可以升级了。
- 复制到 `~/.claude/agents/` 时,不要带上 `global-config/agents/fable-medium.md`。

`/adopt` 会在交互流程中主动询问这一点,并替你完成相应修改;如果你是手动逐个复制文件,请自己完成这一步,以免 Claude 一直尝试调用一个你的套餐根本用不了的子代理。

---

## 可选:本地 AI(Ollama)预压缩

原始配置把本地 Ollama 模型用作一层**免费、有损的预压缩层**——把冗长、低风险的文本(日志、啰嗦的文档)先通过本地模型消化压缩一遍,再送入付费模型的上下文中。它位于成本阶梯中**比 Haiku 更低**的位置,本身不算一个路由层级:没有工具访问权限,没有仓库上下文,纯粹是文本进、文本出。它能省钱,但不增加任何能力。本仓库中的其他内容都不依赖它。

**所以,有一个问题需要你自己回答:你想为此配置本地 Ollama 模型吗?**

### 如果不想
跳过整个章节。从你的 `CLAUDE.md` 副本中删除 Ollama 相关段落,并去掉 `notes/local-ollama-models.md`。没有它,其余部分照样能正常工作。

### 如果想
1. 从 [ollama.com](https://ollama.com) **安装 Ollama**。
2. **决定模型存放位置。** 模型体积很大(一个 27B 模型能有几十 GB),默认位置在系统盘(Windows 上是 `%USERPROFILE%\.ollama`)。如果系统盘空间紧张,把存储位置迁移到更大的盘——原始配置正是出于这个原因,把它放在了 `D:\ollama`。在 Windows 上,拉取模型之前先设置好 `OLLAMA_MODELS` 环境变量指向你选定的路径;其他平台有对应的环境变量或符号链接做法。
3. **至少拉取一个通用指令模型**(例如 `ollama pull qwen2.5:7b-instruct` 或类似的约 7-9B 指令模型——足够小、跑得快,摘要效果也够用)。`notes/local-ollama-models.md` 中记录的原始配置提供了一种可能的组合方式:一个 27B 的大模型追求最佳质量,若干 7-9B 的中等模型兼顾速度/推理/代码,再加一个具备视觉能力的模型(`llava:7b`)——把它当作参考,而不是照单全收的购物清单。
4. **掌握使用模式:** 把文件当输入喂进去,拿到摘要输出——
   ```powershell
   Get-Content <file> | ollama run <model> "<instruction>"
   ```
   (用管道传入文件,不要把长文本塞进命令行参数里。)
5. **记住这条铁律:** 本地模型的输出**永远不是可信的事实来源**。它只是对低风险文本的有损压缩。如果某个决策依赖于这些内容,付费模型必须读原文——永远如此。

这一部分完全可选,可以跳过。它存在的唯一目的就是替批量文本省一点 token 成本。

---

## 与其他 AI 编程工具的兼容性

本模板是专门为 **Claude Code** 打造的。它所依赖的机制——自动加载的 `CLAUDE.md`、`Skill` 工具、`settings.json` 里的 hooks、子代理定义——都是 Claude Code 特有的功能,而不是某种通用文件格式。把 Codex CLI、ChatGPT、Antigravity、Cursor 或其他任何工具指向本仓库,并不会让它自动"识别"这些 skill 或规则;脱离 Claude Code,这里的东西不会开箱即用。

*可以*手动改编的部分:
- `global-config/CLAUDE.md` 是纯文本——把你想要的部分复制进 `AGENTS.md`(Codex CLI 等少数工具会读取这个文件)或自定义系统提示词中。先去掉任何引用 Claude Code 专属机制的内容(spawn_task、Skill 工具、子代理路由)——这些在别的工具里没有意义。
- `global-config/skills/<name>/SKILL.md` 下的每个 skill 本质上就是一份 markdown 指令文件。你可以把某一个粘贴进另一个工具的自定义指令里,但会失去自动触发能力,而且任何附带的脚本都假定运行在某个特定 shell 环境下,不一定能在别的工具里跑起来。
- Hooks(`settings.json`)和子代理文件(`agents/*.md`)是 Claude Code 专属的——没有对应的东西可以移植过去。

如果你日常使用 Codex/ChatGPT/Antigravity,本仓库依然可以当作*参考资料*来用(写作规则、.docx 修复方法、git 安全 hook 的逻辑)——只是需要自己复制粘贴相关部分,而不能指望把整个文件夹丢进去就能用。

---

## 提醒:这是一个人的个人配置

这份快照来自一套具体的工作流:一位泰英双语用户,在 Windows 机器上工作。这一点在各处都能看出来——CLAUDE.md 里的双语章节,以及 PowerShell 与 Bash 之间的种种坑。

有用的就采纳,没用的就丢掉。这里的内容都不是什么规定性的最佳实践——它只是对一个人真正管用的做法,被足够详细地写了下来,使其具备可移植性。真正的价值在于这套系统的*整体形态*(按成本分级路由、把重活外包出去、每类知识只有一个归属地、对破坏性命令设安全网),而不是其中任何一条具体规则。
