# Infinity Loop CLI

Run AI agents for days on a single API call. No rate limits, no interruptions, no blocking.

## One-Line Install

```powershell
git clone https://github.com/AbdallahIsDev/agent-loop.git
```

Then `cd agent-loop` and run:

```powershell
loop init                             # scaffold in current dir
loop init --path C:\path\to\project   # scaffold elsewhere
```

**First `loop init` auto-installs globally to `~/.loop/` and adds to PATH.** After that, `loop` works from any directory.

Cross-platform. One clone. One setup. Zero dependencies beyond Node.js.

## How It Works

```
┌──────────────────────────────────────────────────────────┐
│  Copy README.loop.md → paste into Codex (one API call)   │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────────────────┐
│                   INFINITE LOOP                           │
│                                                           │
│  while true:                                              │
│    read CHECKPOINT.md (context recovery)                  │
│    read MANIFEST.md, SCOPE.md                             │
│    check INBOX.md HIGH PRIORITY → execute immediately     │
│    check INBOX.md QUEUED → take first, do it, remove it   │
│    check QA.md for user answers, expire stale questions   │
│    take top task from QUEUE.md (deps met)                 │
│    execute it, test it, self-review it                    │
│    if git task → commit & push                            │
│    if problem → remove from QUEUE (verified)              │
│    if general task → move to COMPLETED.md                 │
│    rewrite CHECKPOINT.md (under 2000 tokens)              │
│    rewrite STATUS.md (heartbeat + progress + health)      │
│    loop forever                                           │
└───────────────────────────────────────────────────────────┘
```

## The 9 Files

| File | Read Every Cycle | Purpose |
|------|:-:|---------|
| `CHECKPOINT.md` | Yes | Context recovery — read FIRST after compaction, updated every cycle |
| `MANIFEST.md` | Yes | Rules, state machine, git integration, quality bar, skills, self-review loop |
| `SCOPE.md` | Yes | Project boundaries + scope drift log |
| `QUEUE.md` | Yes | Pending tasks with state machine, dependencies, git tracking |
| `INBOX.md` | Yes | HIGH PRIORITY + queued instructions (processed one at a time) |
| `QA.md` | Yes | Structured questions & answers with IDs, expiry, threading |
| `STATUS.md` | Yes | Heartbeat + progress + health metrics (overwritten) |
| `COMPLETED.md` | No | Archive for completed tasks (auto-archives at 50+ entries) |
| `DECISIONS.md` | No | Architecture decisions with timestamps and tags (append only) |

## Task Lifecycle

| Task Type | When Completed | Why |
|-----------|---------------|-----|
| Problem/bug | **Removed** from QUEUE.md | Verified fixed, tested, reviewed. Gone forever. |
| General task | **Moved** to COMPLETED.md | Archived for future reference. QUEUE stays lean. |
| Large task | Detail file in `tasks/` | Sub-tasks in mini-loop. Detail file = working memory. |

## Key Improvements Over v1

- **Context Recovery** — CHECKPOINT.md is rewritten every cycle (under 2000 tokens). After any context compaction, the agent reads it first and recovers its state.
- **Task State Machine** — Tasks follow defined transitions (PENDING → IN_PROGRESS → DONE/WAITING/FAILED). Only one task IN_PROGRESS at a time.
- **Git Integration** — Auto-commit and push after completing tasks in GitHub projects. Skip for non-git tasks.
- **Self-Review Loop** — After every implementation: verify behavior, architecture fit, hidden risks. Fix before moving on.
- **Testing & Verification** — Run test commands, verify edge cases, test like a real user before marking DONE.
- **Structured QA** — Questions have IDs, expiry cycles, priority levels, and context. Stale questions auto-expire.
- **Skills Integration** — Agent is instructed to use all available skills and tools to complete tasks efficiently.
- **Memory Management** — COMPLETED.md auto-archives at 50+ entries to `.loop/archive/`. Keeps context lean.
- **Scope Drift Detection** — SCOPE.md has structured in-scope/out-of-scope sections plus a drift log.

## Inbox — High Priority System

**HIGH PRIORITY** — Agent drops everything and executes immediately. Use for "stop current task", "exit nested loop", "fix this critical bug now".

**QUEUED INSTRUCTIONS** — Processed one at a time. Agent takes first, completes it, removes it. Next cycle, next instruction becomes first.

## Investigation Protocol

Every problem must be:
1. **Reproduced** — confirm it exists
2. **Verified** — is it real?
3. **Marked** — VERIFIED REAL / PARTIAL / FALSE POSITIVE / OUTDATED / FIXED

## Quality Standards

- **No scaffolding** — never fake implementations, placeholders, or hacks
- **No parallel systems** — improve existing architecture
- **If you find an improvement** — implement it. Hard improvements now prevent bigger problems later.
- **Test everything** — run test commands, verify edge cases, fix failures before marking done

## License

MIT
