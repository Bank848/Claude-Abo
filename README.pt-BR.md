[English](README.md) | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | **Português (Brasil)** | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Claude%20Code%20Clone%20Template&fontSize=38&fontColor=ffffff&fontAlignY=38&desc=A%20portable%20snapshot%20of%20one%20person's%20Claude%20Code%20setup&descAlignY=58&descSize=17&descColor=ffffff&animation=fadeIn" alt="Claude Code Clone Template banner" width="100%"/>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-45%20curated-brightgreen)](#global-configskills)
[![Languages](https://img.shields.io/badge/languages-10-orange)](#top)
[![Template](https://img.shields.io/badge/type-adapt%2C%20not%20run%20as--is-lightgrey)](#caveat-this-is-one-persons-setup)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=17&pause=1200&color=6C63FF&center=true&vCenter=true&width=640&lines=45+curated+skills+with+full+provenance;Cost-aware+Sonnet+%2F+Opus+%2F+Haiku+model+routing;Git+safety+hooks+%2B+%2Fplan-pro+workflow;Cross-project+second-brain+vault" alt="rotating feature highlights"/>

</div>

Um retrato portátil da configuração de Claude Code de uma pessoa — instruções, skills, hooks e um cofre de conhecimento, empacotados para que uma instância nova do Claude Code consiga reproduzir os mesmos hábitos em uma máquina nova. **Um template para adaptar, não uma configuração para rodar como está.**

<details>
<summary>Leia a proposta completa</summary>

Um retrato portátil da configuração de Claude Code de uma pessoa: instruções globais, regras de engenharia, **45 skills selecionadas** (7 de autoria própria — 3 escritas do zero, 4 wrappers próprios em torno de ferramentas de terceiros — 1 adaptada de uma skill upstream, e o restante adotado de repositórios upstream, todas com proveniência individual registrada em `sources.json`), exemplos reais de memória, um manifesto de proveniência de skills e um cofre de conhecimento entre projetos, empacotados para que uma instância nova do Claude Code (ou a pessoa que está configurando uma) possa reproduzir os mesmos hábitos de fluxo de trabalho e capacidades em uma máquina nova. Este é um **template para adaptar, não uma configuração para rodar como está**: identificadores pessoais foram removidos e substituídos por placeholders, e várias seções só fazem sentido se você também adotar as ferramentas que elas descrevem.

</details>

## Começando (guia rápido)

> **Atalho:** clone o repositório, abra-o no Claude Code e rode `/adopt` — ele te entrevista e faz os passos 2, 3, 5 e 7 abaixo por você, marcando o progresso em um arquivo de diário retomável conforme avança. O passo 6 (instalar os próprios ecossistemas de plugins) fica deliberadamente fora do escopo do `/adopt` — esse ainda é por sua conta.

<p align="center"><img src="assets/quickstart-flow.svg" alt="Clone, depois copie as configs, depois rode /adopt, depois verifique" width="100%"/></p>

| # | Passo | Onde |
|---|---|---|
| 1 | Clone o repositório | em qualquer lugar conveniente |
| 2 | Decida: quer pré-compressão com Ollama local? | veja [Opcional: IA local](#opcional-pré-compressão-com-ia-local-ollama) |
| 3 | Copie as configs para `~/.claude/` | `CLAUDE.md`, `agents/*.md`, `hooks/*.py`, `skills/*`, `tools/` — **reescreva "Installed Plugins" primeiro** |
| 4 | Mescle as settings | `global-config/settings.example.json` → `~/.claude/settings.json` (substitua `<YOUR_HOME>`) |
| 5 | Faça find-and-replace dos placeholders | lista completa em [Como adotar isto](#como-adotar-isto), passo 8 |
| 6 | Instale os ecossistemas de plugins | veja [O que você ainda vai precisar instalar](#o-que-você-ainda-vai-precisar-instalar-separadamente) |
| 7 | Copie `notes/` + `memory-examples/` (opcional) | seu próprio cofre / pasta de auto-memória |
| 8 | Verifique | peça um plano de implementação — `/plan-pro` é acionado? |

Equipe multi-agente (Codex, Cursor, Gemini CLI, ...)? Copie também `global-config/AGENTS.md` para a raiz de cada projeto — veja [Compatibilidade com outras ferramentas de codificação com IA](#compatibilidade-com-outras-ferramentas-de-codificação-com-ia).

O resto deste README explica cada peça em detalhes.

## O que tem aqui

```
claude-clone-template/
├── README.md
├── LICENSE                                # MIT license for this repo's own content
├── ATTRIBUTION.md                         # Credits for the upstream repos the third-party skills were adopted from
├── .claude/commands/adopt.md              # Run `/adopt` in this repo to interview + auto-apply the steps below
├── global-config/
│   ├── CLAUDE.md                          # Global instruction file (~/.claude/CLAUDE.md equivalent)
│   ├── AGENTS.md                          # Subconjunto portátil do CLAUDE.md para agentes que não são Claude Code (Codex, Cursor, Gemini CLI, ...)
│   ├── settings.example.json              # Sanitized ~/.claude/settings.json — hooks, plugins, model default
│   ├── agents/                            # 3 pinned-model subagent definitions (opus, haiku-batch, fable-medium)
│   ├── hooks/block-dangerous-git.py       # PreToolUse gate that asks before risky git commands
│   ├── hooks/graphify-auto-update.py      # Hook PostToolUse — mantém o grafo de conhecimento do graphify sincronizado após cada edição
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
O coração da configuração. Ele codifica:

- **Roteamento de modelos sensível a custo** — loop principal no Sonnet como orquestrador, delegando a subagentes Haiku/Opus/Fable de acordo com a dificuldade da tarefa, com regras rígidas sobre quem lê arquivos brutos e quem lê apenas conclusões.
- **Delegação de execução pesada** — disparar jobs grandes em sessões separadas em vez de inchar (e encarecer) a sessão atual.
- **Fluxo de planejamento** — `/plan-pro` como planejador padrão.
- **Convenção do cofre de segundo cérebro** — uma única regra ("está atrelado a um repositório?") que decide o que fica no cofre e o que fica nos docs/ADRs de um repositório.
- **Hook de segurança do git** — um gate PreToolUse que pergunta antes de comandos destrutivos do git.
- **Hook de sincronização automática do graphify** — um hook PostToolUse que mantém o grafo de conhecimento atualizado após cada edição, sem bloquear a edição em si.
- **Pegadinhas de shell** — regras de heredoc do Bash tool versus PowerShell tool (dor de cabeça específica do Windows, aprendida na marra).
- **Automonitoramento de contexto** — quando o Claude deve sugerir `/compact` proativamente.
- **Regras anti-marca-registrada-de-IA na escrita** — um conjunto completo de regras em tailandês e inglês para fazer texto redigido parecer escrito por humano (vocabulário a evitar, padrões estruturais, adequação de registro); a peça maior e mais reutilizável do arquivo. O detalhamento de apoio está em `memory-examples/`.
- **PR sempre como draft por padrão**, **pedir confirmação antes de agendar cron/agentes na nuvem**, **narração enxuta durante comandos de execução longa**, uma **pegadinha de grupo de abas compartilhado no claude-in-chrome** para sessões paralelas, e uma **checagem proativa de RLS do Supabase** para qualquer projeto que use Supabase.

### `global-config/rules/ecc-common/`
Disciplina geral de engenharia do ecossistema de plugins ecc (everything-claude-code): fluxo de TDD, imutabilidade, formato de commit, checklist de segurança, níveis de severidade de code review, delegação a agentes. Só é útil se você também usar o ecc (veja "O que você ainda vai precisar instalar" abaixo).

### `global-config/skills/`
45 pastas `SKILL.md` selecionadas (mais scripts/referências/dados de apoio quando a skill os tem) cobrindo ofício de escrita/marketing (copywriting, copy-editing, hallmark, marketing-council, pricing...), processo de engenharia (debug-mantra, poka-yoke, second-brain, dependency-audit, secrets-audit...), design (design-system, ui-ux-pro-max, banner-design, mobbin-references...) e meta-skills para gerenciar o próprio Claude Code (skillify, grilling, second-brain, graphify, plan-pro, shipping-a-branch...). `poka-yoke`, `plan-pro` e `shipping-a-branch` são de autoria própria e escritas do zero; `graphify`, `dembrandt`, `markitdown` e `mobbin-references` são skills-wrapper próprias, cujo SKILL.md é original mas cujas ferramentas subjacentes são de terceiros (creditadas em `ATTRIBUTION.md` e com versão rastreada em `sources.json`); `deslop-defaults` é adaptada (extraída de `ibelick/ui-skills` e reescrita de forma agnóstica de stack); o restante é adotado de repositórios upstream — veja `sources.json` para a proveniência de cada skill e `ATTRIBUTION.md` para os créditos das fontes upstream. São artefatos de prompt engineering genuinamente reutilizáveis, não apenas descrições de skills — copie-os para `~/.claude/skills/` e eles funcionam imediatamente.

<details>
<summary><b>Ver as 45 skills, agrupadas por categoria</b> (clique para expandir)</summary>

**Processo de engenharia e fluxo de trabalho (15)**

| Skill | O que faz |
|---|---|
| `debug-mantra` | Disciplina de depuração em quatro passos (reproduzir → rastrear → refutar → cruzar referências) recitada antes de propor qualquer correção. |
| `poka-yoke` *(autoria própria)* | Revisão à prova de erros — torna um estado ruim impossível/óbvio na origem em vez de detectá-lo depois do fato. |
| `post-mortem` | Redige o relatório canônico de causa raiz depois que um bug é corrigido e validado. |
| `scrutinize` | Revisão com perspectiva de outsider de um plano/PR/diff — checa a intenção primeiro, depois rastreia o caminho real do código. |
| `shipping-a-branch` *(autoria própria)* | Conduz commit → push → PR → review → merge de ponta a ponta, confirmando cada passo arriscado separadamente. |
| `plan-pro` *(autoria própria)* | Escritor de planos de implementação com um loop de revisão multiagente disparado e saída em HTML com antes/depois. |
| `dependency-audit` | Checa as dependências do projeto em busca de CVEs conhecidas e riscos de supply chain. |
| `secrets-audit` | Varre código-fonte, histórico do git e infraestrutura em busca de credenciais vazadas e postura fraca de gestão de segredos. |
| `prompt-injection` | Audita apps/agentes em busca de vulnerabilidades de prompt injection e violação de limites de permissão de LLM. |
| `decide` | Fluxo estruturado de tomada de decisão (conjunto de perguntas estilo 37signals) que também arquiva a justificativa. |
| `unstuck` | Banco de técnicas de pensamento lateral para destravar um obstáculo em vez de reportar "não é possível". |
| `teach` | Ensina o usuário um novo conceito/habilidade dentro do workspace atual. |
| `wait-what` | Sinaliza uma mensagem que não foi compreendida e a reapresenta. |
| `skillify` | Cria, adapta ou atualiza uma skill do Claude Code (a partir de chat, vídeo, despejo de conteúdo ou repositório externo). |
| `wizard` | Gera um assistente interativo em bash para passos que só um humano pode executar (credenciais, dashboards, migrações). |

**Design e UI (11)**

| Skill | O que faz |
|---|---|
| `banner-design` | Projeta banners sociais/de anúncio/web/impressos em vários estilos de direção de arte. |
| `design` | Skill de design amplo — logos, mockups de CIP, slides, banners, ícones, fotos sociais. |
| `design-system` | Arquitetura de design tokens em três camadas (primitiva → semântica → componente), mais geração de slides. |
| `deslop-defaults` *(adaptada)* | Padrões estruturais que impedem que UI gerada por IA pareça "média demais" (z-index, contenção de cor de destaque, estados). |
| `hallmark` | Skill de design anti-slop de IA para páginas do zero, redesenhos e extração de design a partir de URLs/screenshots. |
| `ui-styling` | Constrói UI acessível com shadcn/ui, Tailwind e temas com suporte a dark mode. |
| `ui-ux-pro-max` | Base de dados pesquisável de UI/UX — estilos, paletas, combinações de fontes, diretrizes de UX, presets de movimento, tipos de gráfico. |
| `mobbin-references` | Traz screenshots de referência de apps reais (onboarding, paywalls, estados vazios...) antes de uma UI ser desenhada. |
| `dembrandt` *(wrapper)* | Extrai os design tokens reais de um site ao vivo (cores, tipografia, espaçamento) via inspeção de DOM/CSS. |
| `image` | Gera/edita/otimiza imagens de marketing (heroes, gráficos sociais, mockups, imagens OG). |
| `slides` | Constrói apresentações estratégicas em HTML com Chart.js e temas de design tokens. |

**Marketing, conteúdo e marca (13)**

| Skill | O que faz |
|---|---|
| `brand` | Voz de marca, identidade visual, frameworks de mensagem e checagens de consistência. |
| `community-marketing` | Estratégia de crescimento liderado por comunidade (Discord/Slack/fórum, programas de embaixadores, advocacy). |
| `content-strategy` | Decide que conteúdo criar — clusters de tópicos, calendários editoriais, pilares de conteúdo. |
| `copy-editing` | Edita/aperta/atualiza copy de marketing já existente. |
| `copywriting` | Escreve nova copy de marketing para páginas de landing/preço/funcionalidade/sobre. |
| `launch` | Planeja um lançamento de produto, anúncio de funcionalidade ou checklist de go-to-market. |
| `management-talk` | Reescreve textos de engenheiro para engenheiro em linguagem de liderança, ajustada ao canal de destino (Slack/e-mail/standup). |
| `marketing-council` | Conselho consultivo simulado de marqueteiros nomeados debatendo uma questão de posicionamento. |
| `marketing-ideas` | Gerador de ideias de growth/marketing para produtos SaaS e de software. |
| `marketing-psychology` | Aplica princípios de ciência comportamental (ancoragem, prova social, enquadramento) a decisões de marketing. |
| `pricing` | Estratégia de preço/empacotamento e auditorias de página de preços. |
| `product-marketing` | Constrói o documento de contexto reutilizável de produto/público/posicionamento que outras skills de marketing referenciam. |
| `social` | Criação de conteúdo social, agendamento, reaproveitamento e social listening em várias plataformas. |

**Pesquisa e gestão de conhecimento (6)**

| Skill | O que faz |
|---|---|
| `deep-research` | Briefing de pesquisa multi-fonte e multi-passada com citações, contradições e lacunas. |
| `graphify` *(wrapper, autoria própria)* | Transforma qualquer entrada (código/docs/artigos/imagens) em um grafo de conhecimento agrupado com relatório de auditoria. |
| `grilling` | Entrevista o usuário sem trégua para estressar um plano antes de construí-lo. |
| `second-brain` | Fluxo de captura/compilação/consulta/lint/conexão para um cofre de conhecimento pessoal estilo Obsidian. |
| `watch-video` | Extrai conteúdo em transcrição/visual/multimodal de qualquer fonte de vídeo suportada pelo yt-dlp. |
| `markitdown` *(wrapper)* | Converte PDFs/slides/planilhas/áudio/HTML/etc. em Markdown limpo para uso em LLM/RAG. |

A proveniência completa (repositório de origem, data de adoção, autoria própria vs. adotada vs. adaptada) de cada entrada está em `global-config/tools/skill-update-check/sources.json`; os créditos das fontes upstream estão em `ATTRIBUTION.md`.

</details>

### `global-config/memory-examples/`
7 entradas reais do sistema de auto-memória do Claude Code do dono original (não são fatos específicos de projeto, e sim hábitos portáveis de "como eu trabalho"): uma desambiguação de convenção de nomes para mensagens entre sessões, o padrão de usar Ollama local como pré-compressão, uma regra sobre o que "atualizar o caderno de skills" de fato significa operacionalmente, uma pegadinha de escaping de shell (`\b` virando silenciosamente um byte de backspace), uma entrada de feedback sobre o quão agressivamente cortar o inchaço de contexto, e o detalhamento completo de apoio (tabelas de vocabulário + exemplos de antes/depois) das regras anti-marca-de-IA na escrita presentes no CLAUDE.md, tanto em tailandês quanto em inglês. Elas existem para mostrar a *forma* de uma boa entrada de memória (regra + porquê + como aplicar) tanto quanto o conteúdo específico — veja `global-config/rules/ecc-common/` para como a memória se encaixa no fluxo de trabalho mais amplo, e a seção "จำ/บัญญัติ" do CLAUDE.md para a distinção entre memória local e global que este dono usa.

### `global-config/tools/skill-update-check/sources.json`
O manifesto real de adoção de skills/ferramentas do dono — dados de proveniência reais (URLs de repositórios de origem, notas de instalação, histórico de versão) para as 45 skills pessoais (incluindo as de autoria própria e as adaptadas), mais 3 pacotes pip, 2 pacotes npm e 1 ferramenta binária. Combinado com `check.ps1`, é isso que permite que quem adota o `claude-clone-template` acompanhe atualizações upstream das skills que copiou para `~/.claude/skills/`, do mesmo jeito que o dono original faz. Os valores de `last_seen_commit` geralmente estarão `unknown`/desatualizados do ponto de vista de quem recebe o repositório, até que essa pessoa rode `check.ps1 -Ack` uma vez para estabelecer sua própria linha de base.

### `global-config/templates/`
Dois arquivos iniciais pequenos (`project-CLAUDE.md`, `conventions.md`) para copiar em um novo repositório na primeira configuração — um `project-CLAUDE.md` "roteador" de no máximo 45 linhas e um template de convenções/critério de aprovação. Cada um tem um bloco de comentário com um PRESET de preencher-a-lacuna para a stack que você está inicializando (atualmente só um exemplo de Python-web); adicione seu próprio preset da mesma forma se a sua stack precisar de um.

### `notes/`
Conteúdo de exemplo do cofre de segundo cérebro do Obsidian do dono: inventário de modelos locais do Ollama, repositórios marcados como favoritos e notas diversas de referência. Elas mostram *que tipo de coisa* pertence a um cofre entre projetos — não são obrigatórias universais. Mantenha a ideia da estrutura, substitua o conteúdo pelo seu com o tempo.

## Como adotar isto

1. **Copie `global-config/CLAUDE.md`** para o seu próprio `~/.claude/CLAUDE.md`. Mescle com o que você já tem, ou substitua por completo — a decisão é sua. Leia primeiro; apague seções que não se aplicam a você. **Reescreva a seção "Installed Plugins" antes de fazer qualquer outra coisa com este arquivo** — ela atualmente afirma que plugins específicos (superpowers, ecc, pordee, lazyweb, andrej-karpathy-skills) estão instalados e habilitados, e instrui o Claude a não mencionar que é preciso instalá-los. Isso é verdade para o dono original, não para você. Substitua pela sua própria lista real de plugins, ou apague até você ter instalado algo.
2. **Copie `global-config/agents/*.md`** para `~/.claude/agents/` e **`global-config/hooks/*.py`** para `~/.claude/hooks/`. São essas cópias que fazem as regras de roteamento de modelo, o gate de segurança do git e o hook de sincronização automática do graphify no CLAUDE.md funcionarem de verdade, e não apenas existirem como texto.
3. **Copie `global-config/skills/*`** para `~/.claude/skills/`. Essa é a maior parte do valor real — 45 pastas de skills funcionais, não só descrições delas.
4. **Mescle `global-config/settings.example.json`** no seu próprio `~/.claude/settings.json` (primeiro substitua `<YOUR_HOME>` pelo seu caminho de home real). Mescle, não sobrescreva, se você já tiver um settings.json — pegue a entrada `hooks.PreToolUse` e o que mais quiser de `enabledPlugins`. O comando do hook, como está, usa o launcher `py` do Windows; no macOS/Linux, troque para `python3` primeiro.
5. **Copie `global-config/rules/ecc-common/`** para `~/.claude/rules/` **somente se** você instalar o plugin ecc. Caso contrário, pule.
6. **Copie `global-config/memory-examples/*.md`** para a pasta de auto-memória do projeto ao qual você quer que elas se apliquem (a auto-memória do Claude Code é por projeto, em `~/.claude/projects/<project>/memory/`), ou leia-as como referência e escreva as suas do zero.
7. **Copie `notes/`** para o seu próprio local de cofre de segundo cérebro (qualquer pasta que o Obsidian ou ferramentas de markdown simples consigam enxergar), ou pule completamente se não quiser um cofre.
8. **Faça find-and-replace de todos os placeholders** — este é o passo mais importante:
   - `<YOUR_USERNAME>`, `<YOUR_HOME>` → seu nome de usuário real do Windows/sistema e caminho de home
   - `<YOUR_VAULT_PATH>` → onde quer que você mantenha (ou pretenda manter) o seu cofre de segundo cérebro
9. **Copie `global-config/tools/`** (tanto `skill-update-check/` quanto, se você manteve o Ollama, `ollama/`) para `~/.claude/tools/`, depois **defina a sua própria linha de base em `sources.json`**: rode `check.ps1 -Ack` uma vez depois de copiar as skills, para que `last_seen_commit` reflita um ponto de partida sob seu controle e não o histórico do dono original.

## O que você ainda vai precisar instalar separadamente

Este repositório contém **referências e regras para** ecossistemas de skills — não os ecossistemas em si. Para que as instruções do CLAUDE.md signifiquem alguma coisa, você precisa instalar:

- **superpowers** (obra/superpowers) — skills de brainstorming, escrita de planos, TDD, depuração
- **ecc / everything-claude-code** (affaan-m/ECC) — agentes, skills, comandos, servidores MCP
- Qualquer outro plugin citado em `SKILLS_INDEX.md` que você decidir que quer

Instale-os pelo sistema de plugins do Claude Code na máquina nova, depois reconcilie `SKILLS_INDEX.md` com o que você realmente instalou.

---

## Uma nota sobre o plano de assinatura e o tier Fable 5.1

A escada de roteamento do `CLAUDE.md` tem como teto um subagente `fable-medium`, que exige um plano Max — no Pro, disparar esse subagente simplesmente falha. O `/adopt` pergunta sobre isso e resolve para você.

<details>
<summary>Correção manual se você não estiver no Max</summary>

A escada de roteamento de modelos em `CLAUDE.md` tem como topo um subagente `fable-medium` — um nível de escalada deliberadamente caro e de uso raro, para os problemas mais difíceis. O dono original está em um plano **Max**, onde esse modelo está disponível. Se você está no **Pro** (ou qualquer plano sem acesso ao Fable 5.1), disparar `fable-medium` simplesmente vai falhar.

Antes de copiar o `CLAUDE.md` como está, confira em qual plano você está. Se você não tem o Fable 5.1:
- Apague os parágrafos do `fable-medium` e o item "สุดบันได" (topo da escada) da seção de roteamento de modelos.
- Mude o teto da escada para parar no `opus` — a lógica de roteamento (escalar para o Opus em trabalho difícil/de alto risco) continua valendo, só que sem um nível acima do Opus para escalar.
- Remova `global-config/agents/fable-medium.md` do que você copia para `~/.claude/agents/`.

O `/adopt` pergunta isso como parte da sua entrevista e faz essa edição por você; se você estiver copiando os arquivos na mão, faça isso você mesmo para que o Claude não fique tentando disparar um subagente que o seu plano não alcança.

</details>

---

## Opcional: pré-compressão com IA local (Ollama)

Um nível gratuito e com perdas de pré-compressão — um modelo local resume texto longo e de baixo risco antes de ele chegar ao contexto de um modelo pago. Não adiciona capacidade nenhuma, é puro corte de custo. Pode ser pulado; nada mais aqui depende dele.

<details>
<summary>Detalhes — você quer isso?</summary>

A configuração original usa modelos locais do Ollama como um **nível de pré-compressão gratuito e com perdas** — passando texto longo e de baixo risco (logs, documentação verbosa) por um modelo local para condensá-lo *antes* de ele entrar no contexto de um modelo pago. Ele fica **abaixo do Haiku** na escada de custos e não é um nível de roteamento: sem acesso a ferramentas, sem contexto de repositório, apenas texto entra / texto sai. Ele economiza dinheiro; não adiciona capacidade. Nada mais neste repositório depende dele.

**Então, uma pergunta que você precisa responder por conta própria: você quer configurar modelos locais do Ollama para isso?**

### Se não
Pule esta seção inteira. Apague os parágrafos do Ollama da sua cópia do `CLAUDE.md` e descarte `notes/local-ollama-models.md`. Tudo o mais funciona normalmente sem isso.

### Se sim
1. **Instale o Ollama** a partir de [ollama.com](https://ollama.com).
2. **Decida onde o armazenamento de modelos vai ficar.** Os modelos são grandes (um modelo de 27B tem dezenas de GB) e o local padrão fica no seu drive de sistema (`%USERPROFILE%\.ollama` no Windows). Se o seu drive de sistema estiver apertado em espaço, realoque o armazenamento para um drive maior — a configuração original usou `D:\ollama` exatamente por esse motivo. No Windows, defina a variável de ambiente `OLLAMA_MODELS` para o caminho escolhido antes de baixar modelos; outras plataformas têm abordagens equivalentes com variáveis de ambiente ou links simbólicos.
3. **Baixe pelo menos um modelo instruct de propósito geral** (por exemplo `ollama pull qwen2.5:7b-instruct` ou um modelo instruct similar de ~7–9B — pequeno o suficiente para rodar rápido, bom o suficiente para resumir). O inventário original em `notes/local-ollama-models.md` mostra um leque possível: um 27B pesado para melhor qualidade, modelos de 7–9B intermediários para velocidade/raciocínio/código, e um modelo com capacidade de visão (`llava:7b`) — trate essa lista como inspiração, não como lista de compras.
4. **Aprenda o padrão de uso:** passe um arquivo pelo pipe, receba um resumo de volta —
   ```powershell
   Get-Content <file> | ollama run <model> "<instruction>"
   ```
   (Passe o arquivo pelo pipe; não empurre prompts longos para o argumento.)
5. **Saiba a única regra rígida:** a saída de modelo local **nunca é fonte da verdade**. É compressão com perdas para texto de baixo risco. Se uma decisão depende do conteúdo, o modelo pago lê o original — sempre.

Isso é 100% opcional e dispensável. Existe puramente para reduzir custo de token em texto em volume.

</details>

---

## Compatibilidade com outras ferramentas de codificação com IA

Dois arquivos são distribuídos em vez de um: `CLAUDE.md` (exclusivo do Claude Code) e `AGENTS.md` (o subconjunto portátil — [agents.md](https://agents.md), também lido por Codex, Cursor, Gemini CLI, Copilot).

<details>
<summary>Como os dois interagem</summary>

Este template foi construído especificamente para o **Claude Code**, mas a partir do Claude Code 2.1.277 (setembro de 2026), o próprio Claude Code também lê o [`AGENTS.md`](https://agents.md) como alternativa quando um projeto não tem `CLAUDE.md` — a mesma convenção que o Codex CLI, o Cursor, o Gemini CLI e o GitHub Copilot já leem. É por isso que este template distribui dois arquivos em vez de um:

- **`global-config/CLAUDE.md`** — a configuração completa: roteamento de modelos sensível a custo, `/plan-pro`, o catálogo de skills, hooks, roteamento de subagentes, tudo que só significa alguma coisa dentro do Claude Code.
- **`global-config/AGENTS.md`** — o subconjunto portátil (estilo de código, fluxo de git, testes, code review, checklist de segurança, padrões comuns) com todo mecanismo exclusivo do Claude Code removido. Solte-o em qualquer projeto e qualquer agente que entenda AGENTS.md o capta, Claude Code incluso.

Se um projeto tem **os dois** arquivos, o Claude Code lê o `CLAUDE.md` e ignora o `AGENTS.md` — os dois não são mesclados, então não espere que as regras específicas do Claude Code se apliquem só porque o AGENTS.md também está presente. Outras ferramentas (Codex, Cursor, etc.) só leem o `AGENTS.md`; elas não têm nenhum conceito de `CLAUDE.md`, da ferramenta `Skill`, de hooks do `settings.json` ou de definições de subagente, então essas peças continuam exclusivas do Claude Code de qualquer forma.

O que mais *pode* ser adaptado manualmente, se você quiser mais do que o subconjunto do AGENTS.md:
- Cada skill em `global-config/skills/<name>/SKILL.md` é só um arquivo de instrução em markdown. Você pode colar uma delas nas instruções personalizadas de outra ferramenta, mas perde o acionamento automático, e qualquer script embutido pressupõe um shell que a ferramenta consiga de fato rodar.
- Hooks (`settings.json`) e os arquivos de subagente (`agents/*.md`) são exclusivos do Claude Code — não há equivalente para portá-los.

Se você usa Codex/Cursor/Gemini CLI no dia a dia, o `AGENTS.md` já te dá as regras de disciplina de engenharia de cara; o resto do repositório (skills, hooks, os ajustes de .docx) continua ali como material de referência para copiar/colar.

</details>

---

## Ressalva: esta é a configuração de uma pessoa

Este retrato vem de um fluxo de trabalho específico: um usuário bilíngue tailandês-inglês em uma máquina Windows. Isso aparece em todo lugar — as seções bilíngues no CLAUDE.md, as pegadinhas de PowerShell versus Bash.

Adote o que for útil, descarte o que não for. Nada disso é boa prática prescritiva — é o que funcionou para uma pessoa, escrito de forma boa o suficiente para ser portátil. O valor real está na *forma* do sistema (roteamento por custo, delegação de trabalho pesado, um único lugar por peça de conhecimento, gates de segurança em comandos destrutivos), não em nenhuma regra individual isolada.
