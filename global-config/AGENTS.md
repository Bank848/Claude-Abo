# AGENTS.md

Portable engineering rules for any AI coding agent that reads this file — Claude Code (2.1.277+), Codex CLI, Cursor, Gemini CLI, GitHub Copilot, and others that follow the [AGENTS.md](https://agents.md) convention.

This is the tool-agnostic subset of this repo's `CLAUDE.md`: the parts that describe how to write and ship code, not how to drive Claude Code specifically. It has no dependency on the Skill tool, subagent definitions, hooks, or any other Claude Code-only mechanism — copy it into any project and it holds up on its own.

If you're setting up Claude Code and already have `CLAUDE.md` in the project, that file takes precedence over this one; the two aren't meant to be read together. Use this file when the project (or the team) is worked on by more than one coding agent and you want one shared source of truth instead of a duplicate per tool.

## Coding Style

**Immutability.** Create new objects, don't mutate existing ones — it prevents hidden side effects and makes debugging tractable.

**KISS.** Prefer the simplest solution that actually works. Optimize for clarity over cleverness; don't optimize before you have a reason to.

**DRY, but not speculatively.** Extract repeated logic once the repetition is real, not in anticipation of it. Copy-paste drift is worse than a small amount of duplication.

**YAGNI.** Don't build features or abstractions before something needs them. Start simple, refactor when the pressure is real.

**File organization.** Many small, cohesive files beat a few large ones — aim for 200-400 lines, treat 800 as a hard ceiling, and organize by feature/domain rather than by technical layer.

**Error handling.** Handle errors explicitly at every level. User-facing errors get a readable message; server-side errors get full context in the logs. Never swallow an error silently.

**Input validation.** Validate at every system boundary — user input, API responses, file contents, anything from outside the process. Never trust external data implicitly.

**Naming.** `camelCase` for variables/functions (booleans prefixed `is`/`has`/`should`/`can`), `PascalCase` for types/interfaces/components, `UPPER_SNAKE_CASE` for constants.

**Code smells to avoid.** Deep nesting (prefer early returns), magic numbers (use named constants), long functions (split by responsibility).

## Development Workflow

Before writing new code:
1. **Search for existing solutions first** — check package registries (npm, PyPI, crates.io, etc.), library docs, and open-source implementations that already solve most of the problem. Prefer adopting or porting a proven approach over writing net-new code that duplicates it.
2. **Plan before implementing** — for anything beyond a trivial change, sketch the approach (what changes, what it touches, what could break) before touching code.
3. **Write tests first where the project has a test suite** — red, green, refactor. See Testing below.
4. **Review before merging** — see Code Review below.
5. **Commit and push** — see Git Workflow below.

## Testing

- Aim for meaningful coverage across unit, integration, and end-to-end tests appropriate to the change — not just unit tests for their own sake.
- TDD cycle: write a failing test (RED), write the minimal implementation to pass it (GREEN), refactor (IMPROVE), then confirm coverage.
- Use the Arrange-Act-Assert structure and name tests after the behavior under test (`returns empty array when no results match`, not `test1`).
- When a test fails, fix the implementation, not the test — unless the test itself is wrong, and that's worth calling out explicitly rather than silently changing.

## Code Review

**Review before any commit to a shared branch**, and always when the change touches auth, payments, user data, or architecture.

Before requesting review: CI is green, merge conflicts are resolved, the branch is up to date with its target.

Checklist:
- [ ] Readable, well-named, functions under ~50 lines, files under ~800
- [ ] No deep nesting, no magic numbers, no dead code
- [ ] Errors handled explicitly, no silent failures
- [ ] No hardcoded secrets or credentials
- [ ] No leftover debug/console output
- [ ] Tests exist for new behavior and pass

Severity levels: **CRITICAL** (security/data loss — blocks merge), **HIGH** (bug or real quality issue — should fix before merge), **MEDIUM** (maintainability — worth fixing), **LOW** (style — optional).

Watch specifically for: hardcoded credentials, SQL injection via string-concatenated queries, unescaped user input (XSS), unsanitized file paths (path traversal), missing auth checks, N+1 queries, unbounded queries without pagination or limits.

## Security

Before any commit:
- [ ] No hardcoded secrets (API keys, passwords, tokens) — use environment variables or a secret manager
- [ ] All user input validated
- [ ] Parameterized queries (no string-concatenated SQL)
- [ ] Sanitized HTML output (no unescaped user input)
- [ ] CSRF protection where sessions are used
- [ ] Auth/authorization verified on every endpoint that needs it
- [ ] Rate limiting on public endpoints
- [ ] Error messages don't leak internals or secrets

If a security issue turns up: stop, fix the CRITICAL issue before doing anything else, rotate any secret that may have been exposed, and check the rest of the codebase for the same mistake before moving on.

## Common Patterns

**Repository pattern for data access.** Put a consistent interface (`findAll`, `findById`, `create`, `update`, `delete`) between business logic and storage. Business logic depends on the interface, not the concrete database/API/file backend — this is what makes swapping storage or mocking in tests cheap.

**Consistent API response envelope.** Every response carries a success/status indicator, a nullable data payload, a nullable error message, and pagination metadata (`total`, `page`, `limit`) where relevant. Don't let different endpoints invent their own shape.

## Git Workflow

Commit format:
```
<type>: <description>

<optional body>
```
Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.

Don't add an AI-attribution trailer (`Co-Authored-By: Claude`, `Generated with ...`, or similar) to commit messages or PR bodies unless the human you're working with explicitly asks for it.

Pull requests:
1. Look at the full commit history for the branch, not just the latest commit (`git diff <base-branch>...HEAD`)
2. Write a summary that explains the *why*, not just a restatement of the diff
3. Include a test plan
4. Push with `-u` on a new branch
