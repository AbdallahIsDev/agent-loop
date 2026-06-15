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
│    read MANIFEST.md, SCOPE.md                             │
│    check INBOX.md HIGH PRIORITY → execute immediately     │
│    check INBOX.md QUEUED → take first, do it, remove it   │
│    check QA.md for user answers                           │
│    take top task from QUEUE.md                            │
│    execute it                                             │
│    if problem → remove from QUEUE (verified)              │
│    if general task → move to COMPLETED.md                 │
│    rewrite STATUS.md (heartbeat + progress + tracker)     │
│    loop forever                                           │
└───────────────────────────────────────────────────────────┘
```

## The 8 Files

| File | Read Every Cycle | Purpose |
|------|:-:|---------|
| `MANIFEST.md` | Yes | Rules, anti-laziness, never-stop guarantee |
| `SCOPE.md` | Yes | Product boundaries, prevents drift |
| `QUEUE.md` | Yes | Pending tasks (problems removed when fixed, general tasks archived) |
| `INBOX.md` | Yes | HIGH PRIORITY + queued instructions (processed one at a time) |
| `QA.md` | Yes | Questions & answers — agent asks, user answers (never blocks) |
| `STATUS.md` | Yes | Heartbeat + current progress + completion tracker (overwritten) |
| `COMPLETED.md` | No | Archive for completed general tasks (reference only) |
| `DECISIONS.md` | No | Architecture decisions archive (reference only) |

## Task Lifecycle

| Task Type | When Completed | Why |
|-----------|---------------|-----|
| Problem/bug | **Removed** from QUEUE.md | Verified fixed, tested, reviewed. Gone forever. |
| General task | **Moved** to COMPLETED.md | Archived for future reference. QUEUE stays lean. |
| Large task | Detail file in `tasks/` | Sub-tasks in mini-loop. Detail file = working memory. |

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
- **If you find an improvement** — implement it. Do not get lazy. Hard improvements now prevent bigger problems later.

## Skills

Agent auto-applies: **code-review** (after every fix), **security-review** (auth/secrets/permissions), **design** (UI/dashboard/styling).

## Completion Log Format

After each task, log using:

```
**What was done:**
- Files modified: [list]
- What changed: [description]
- Why: [reasoning]
- Tests run: [which ones, results]
- Tests skipped: [why]
```

## License

MIT
