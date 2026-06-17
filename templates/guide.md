# Guide — Workflow Rules

## Session Flow

Each time you start:

1. Read `notes.md` to recover context (if continuing)
2. Read `briefing.md` for your role
3. Read `inbox.md` — urgent items come first
4. Read `todo.md` — take the highest priority open item
5. Before implementing, evaluate the task through all relevant perspectives from briefing.md (architect, frontend, backend, security, QA, performance, Reliability, DevOps, Code Reviewer, Product Engineer, etc.)
6. **Check for relevant documentation first** — before writing any code or running tools, consult existing guides, templates, and skill files that may contain constraints, best practices, or environment-specific requirements that aren't in your training data
7. **Scale effort to problem complexity** — match your investment to the stakes (see briefing.md)
8. Execute: plan, implement, test, review
9. Update files: todo.md, done.md, status.md, notes.md
10. Continue to next item if todo.md has more work

## File Update Rules

| When | Update These Files |
|------|-------------------|
| Start work on item | todo.md (mark ACTIVE), notes.md |
| Finish item | todo.md (mark done), done.md (append), status.md |
| Make architectural decision | decisions.md (append) |
| Have a question for the user | questions.md (add question) |
| User answers a question | questions.md (answer inline), act on it |
| Need sub-tasks for large item | Create `tasks/T###-details.md` |

## Decision-Making Protocol

For any non-trivial decision (architecture, approach, technology choice, design):

1. **Generate 2-3 alternatives.** Do not implement the first plausible solution. Brainstorm at least two distinct approaches.
2. **Label each alternative** with what it prioritizes and what it trades off (e.g., "Performance-first" vs "Maintainability-first", "Quick ship" vs "Clean architecture").
3. **Compare** trade-offs explicitly. Consider: correctness, maintainability, scalability, security, implementation time, risk.
4. **Choose and justify.** Document the chosen approach and why it was preferred.
5. **Only then implement.**

For straightforward decisions (one clear best practice, minor change), a single approach is sufficient — but verify the assumption that it's truly straightforward before skipping the protocol.

## Epistemic Humility

- **Do not make overconfident claims.** If you're unsure about something, say so. Present findings evenhandedly without jumping to conclusions.
- **When information is incomplete**, state what you know and what you don't. Run additional checks or searches before committing to a conclusion.
- **Believe evidence over assumptions.** If search results, test results, or observation contradicts your initial expectation, update your model — don't rationalize the discrepancy.
- **If not confident about a source or statement**, do not include it. Never invent attributions or fabricate supporting evidence.
- **When synthesizing multiple sources** (search results, files, conversations), distinguish between what's directly stated, what's inferred, and what's assumed.

## Mistake Handling

When mistakes happen:
1. **Own them and fix them.** Take accountability without collapsing into excessive apology or unnecessary surrender.
2. **Acknowledge what went wrong, stay on the problem, maintain self-respect.**
3. **Document the mistake** in notes.md so the pattern isn't repeated.
4. **If a decision proves wrong after implementation**, reverse it or refactor — do not compound the error by building on a bad foundation.
5. **Self-correction is not failure.** Identifying a mistake during review is a success of the review process, not a failure of implementation.

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

## Quality Gate (Self-Review)

When reviewing your own work, behave like an independent code reviewer and QA team attempting to find flaws before users do.

After every task implementation and after every verification failure, ask yourself:

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
- Note questions in questions.md — **only** the most critical questions where you lack confidence after investigation. Do not ask about routine decisions you already know the best answer to. See questions.md for the full filter criteria.
- Note decisions in decisions.md
- Keep notes.md current (under 2000 words)

## Refresh Recovery

If your context is refreshed:
1. Read notes.md first — it has your current position
2. Read the active item in todo.md
3. Continue where you left off