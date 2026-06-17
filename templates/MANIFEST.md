# MANIFEST

**Project:** {{PROJECT_NAME}}
**Root:** {{PROJECT_ROOT}}
**Initialized:** {{DATE}}

## Absolute Rules

1. **NEVER STOP.** If QUEUE is empty → run self-audit → generate tasks.
2. **NEVER ask the user directly.** Use QA.md for all questions.
3. **SCOPE.md is MANDATORY.** Every implementation must stay within scope.
4. **Complete EVERY task.** No skipping, no laziness, no deferring.
5. **HIGH PRIORITY inbox first.** Check INBOX.md HIGH PRIORITY every cycle. Execute immediately before anything else.
6. **INBOX.md QUEUED instructions** are processed one at a time. Execute → complete → remove from file → next.
7. **Completed problems = REMOVED** from QUEUE.md (verified fixed, tested, reviewed). Gone forever.
8. **Completed general tasks = MOVED** to COMPLETED.md (archive, reference only).
9. **Big tasks** get a detail file at `.loop/tasks/<task-id>-details.md`. Process sub-tasks there, then return to QUEUE.md.
10. **STATUS.md is rewritten** every cycle (never appended). It is heartbeat + progress + tracker.
11. **INBOX.md is NEVER fully cleared.** Only individual instructions are removed after execution.
12. **Preserve ALL user data.** Never delete sessions, DBs, configs, runtime artifacts.
13. **Self-audit** runs every 10 idle cycles, or at least every 50 cycles even when busy.
14. **If stuck** on same task for 5+ cycles → write blocker to QA.md, move to next task.
15. **Do not trust documented solutions blindly.** Brainstorm your own approach. Compare. Use the better one.
16. **Context recovery.** After any context compaction, read CHECKPOINT.md FIRST before any other file. Rehydrate your state from it.
17. **CHECKPOINT.md must be rewritten** every cycle alongside STATUS.md. Keep it under 2000 tokens.

## Task State Machine

Tasks MUST follow these transitions. Invalid states → auto-correct during self-audit.

```
PENDING → IN_PROGRESS
IN_PROGRESS → DONE | WAITING | FAILED
WAITING → IN_PROGRESS | FAILED
FAILED → PENDING (retry) | archived
```

- Every WAITING task MUST specify its blocker.
- Only ONE task may be IN_PROGRESS at a time.
- If IN_PROGRESS for 10+ cycles → auto-move to WAITING with blocker "stalled", pick next task.
- Every state change MUST be logged in the task's State History.

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

## Quality Bar

Every task must be completed to production quality, not demo quality:
- **Execute end to end.** Do not stop at planning, scaffolding, or "next steps."
- **Build complete behavior**, not fake/stub/placeholder behavior.
- **Handle edge cases**, errors, cleanup, lifecycle, and failure states.
- **Brainstorm before implementing.** Compare viable approaches, choose the simplest robust option.
- **Follow project conventions**, existing architecture, typed contracts, and established abstractions.
- **Be honest.** Do not claim complete unless evidence supports every required gate. Mark unverified work as Partial or Blocked.

## Self-Review Loop

After every task implementation and after every verification failure, run this loop:

1. Does the implementation satisfy the requested behavior and existing architecture?
2. Does it follow project conventions and best practices?
3. Are there hidden risks: security, logic, data loss, race conditions, performance, misleading status?
4. If any answer lacks evidence → fix it, rerun checks, then re-evaluate.
5. Stop only when no release-blocking issue is known.

## Testing & Verification

Before marking any task DONE:
1. **Run the project's test commands** (e.g. `npm test`, `pytest`, `cargo test`, or whatever applies).
2. **Test edge cases** like a real user — empty inputs, wrong auth, missing files, concurrent access.
3. **For user-facing features** — exercise the product as a real user would, verify the full workflow end to end.
4. **For security changes** — verify auth failures, secret redaction, policy enforcement.
5. **Fix failures and rerun** — if a test fails, diagnose, fix, and rerun until it passes.
6. If tests cannot be run, document WHY in the completion log.

## Investigation Protocol

**Don't trust any problem blindly.** Investigate every problem deeply.

Before fixing:
1. **Reproduce** the problem first. Confirm it exists.
2. **Verify if real.** Not every reported issue is valid.
3. **If it has a Solution section:** brainstorm your own approach. Compare. If yours is better, use yours. If the documented one is best, apply it.
4. **If marked FIXED but still in queue:** investigate to verify the fix is real. If truly fixed, remove it. If falsely claimed fixed or partial, fix it properly then remove.
5. **Mark clearly** with one of:
   - `VERIFIED REAL` — confirmed, needs fixing
   - `PARTIAL` — partly true, partly not
   - `FALSE POSITIVE` — not an actual issue
   - `OUTDATED` — was real, already resolved by other work
   - `FIXED` — confirmed resolved

## Quality Standards

- **Never scaffold** fake implementations, placeholders, hacks, or incomplete systems.
- **Do not create parallel systems.** Improve existing architecture.
- **If you find something** that will improve the project now or in the future, implement it. Hard improvements now prevent bigger problems later.
- **No silent data deletion.** If recovery is needed, quarantine and write a recovery report.

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
