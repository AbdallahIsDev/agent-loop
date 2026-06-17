# Guide — Workflow Rules

## Session Flow

Each time you start:

1. Read `notes.md` to recover context (if continuing)
2. Read `briefing.md` for your role
3. Read `inbox.md` — urgent items come first
4. Read `todo.md` — take the highest priority open item
5. Execute: plan, implement, test, review
6. Update files: todo.md, done.md, status.md, notes.md
7. Continue to next item if todo.md has more work

## File Update Rules

| When | Update These Files |
|------|-------------------|
| Start work on item | todo.md (mark ACTIVE), notes.md |
| Finish item | todo.md (mark done), done.md (append), status.md |
| Make architectural decision | decisions.md (append) |
| Have a question for the user | questions.md (add question) |
| User answers a question | questions.md (answer inline), act on it |
| Need sub-tasks for large item | Create `tasks/T###-details.md` |

## Item Lifecycle

- **Problem/Bug** → remove from todo.md when verified fixed + tested + reviewed
- **General Task** → move to done.md when complete
- **Large Task** → create detail file with sub-tasks, process each sub-task

Only ONE item ACTIVE at a time.

## Git Integration

After completing a task that modified files in a Git-tracked project:
- **Git-commit and push** if the project is a GitHub repo. Use message format: `<task-id>: <brief description>`.
- **Do NOT git-commit** for tasks unrelated to the project (disk cleanup, web search, general Q&A, file searches outside the repo).
- Before committing, verify `git status` — only stage files relevant to the completed task.
- If the project has no `.git/` directory, skip git operations entirely.

## Skills

Use your available skills and tools to solve each task efficiently:
- **code-review** — after every fix or implementation, review your own work for bugs, regressions, weak types, bad abstractions
- **security-review** — for any security, auth, secrets, permissions changes; check tokens, CORS, secrets redaction, policy enforcement
- **design** — for UI, frontend, dashboard, styling changes
- **testing tools** — run available test commands, lint, typecheck before marking any task done
- **search/research** — use web search when you need current information or documentation
- **Any other skill you have** — leverage all your capabilities to complete tasks with the highest quality

## Quality Gate (Self-Review Loop)

After every task implementation and after every verification failure, run this loop:

1. Does the implementation satisfy the requested behavior and existing architecture?
2. Does it follow project conventions and best practices?
3. Are there hidden risks: security, logic, data loss, race conditions, performance, misleading status?
4. If any answer lacks evidence → fix it, rerun checks, then re-evaluate.
5. Stop only when no release-blocking issue is known.

## Testing & Verification Gate

Before marking any task DONE:
1. **Run the project's test commands** (e.g. `npm test`, `pytest`, `cargo test`, or whatever applies).
2. **Test edge cases** like a real user — empty inputs, wrong auth, missing files, concurrent access.
3. **For user-facing features** — exercise the product as a real user would, verify the full workflow end to end.
4. **For security changes** — verify auth failures, secret redaction, policy enforcement.
5. **Fix failures and rerun** — if a test fails, diagnose, fix, and rerun until it passes.
6. If tests cannot be run, document WHY in the completion log.

## Documentation Format

After completing any task, log the work using:

```
**What was done:**
- Files modified: [list]
- What changed: [description]
- Why: [reasoning]
- Tests run: [which ones, results]
- Tests skipped: [why]
- Git commit: [hash or "N/A — not a git task"]
```

## Communication

- All communication happens through `.workspace/` files
- Note questions in questions.md
- Note decisions in decisions.md
- Keep notes.md current (under 2000 words)
- Keep status.md factual and concise

## Refresh Recovery

If your context is refreshed:
1. Read notes.md first — it has your current position
2. Read the active item in todo.md
3. Continue where you left off