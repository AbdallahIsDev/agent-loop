# Infinity Loop

Run AI agents for days on a single API call. No rate limits, no interruptions, no blocking.

## The Problem

AI agents like Codex have rate limits. On a free plan, you get ~30 minutes per month. On paid plans, you still hit limits during long tasks.

But there's a trick: **once an agent starts a task, it keeps running until completion — even after your rate limit is exhausted.** You can't send new messages, but the agent doesn't stop.

This system exploits that. You make **one API call**, the agent runs for hours or days, and all communication happens through files.

## How It Works

```
┌──────────────────────────────────────────────────────────┐
│  You copy README.loop.md → paste into Codex              │
│  (ONE API call — agent runs forever)                     │
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

## Install

```bash
npm install -g infinity-loop
```

Or from source (private repo):

```powershell
git clone https://github.com/AbdallahIsDev/agent-loop.git
cd agent-loop
powershell -ExecutionPolicy Bypass .\install.ps1
```

Verify:

```powershell
loop init --help
```

## Usage

```bash
# Initialize in current directory
loop init

# Initialize in another project
loop init --path ../some-project
```

Creates:
- `.loop/` — 8 management files + `tasks/` directory
- `README.loop.md` — the one-shot prompt (copy → paste into Codex)
- Updates `.gitignore` — adds `.loop/` so it never gets pushed

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

## Inbox — High Priority System

The INBOX.md has two sections:

**HIGH PRIORITY** — Agent checks this FIRST every cycle. Drops everything and executes immediately. Use for urgent instructions like "stop current task", "exit nested loop", "fix this critical bug now".

**QUEUED INSTRUCTIONS** — Regular instructions, processed one at a time. Agent takes the first one, completes it, removes it from the file. Next cycle, the next instruction becomes first.

```
Example flow:
  Cycle 1: reads instruction A → does it → removes A from file
  Cycle 2: instruction B is now first → does it → removes B
  Cycle 3: instruction C → ...
```

## Task Lifecycle

| Task Type | When Completed | Why |
|-----------|---------------|-----|
| Problem/bug | **Removed** from QUEUE.md | Verified fixed, tested, reviewed. Gone forever. |
| General task (feature, research, cross-project) | **Moved** to COMPLETED.md | Archived for future reference. QUEUE stays lean. |
| Large task | Detail file created in `tasks/` | Sub-tasks processed in mini-loop. Detail file = working memory. |

## Large Tasks

When a task is too big for one cycle:
1. QUEUE.md has one entry linking to `.loop/tasks/<task-id>-details.md`
2. The detail file contains sub-tasks as a checklist
3. Agent processes sub-tasks one by one, marking each done
4. After context compaction, agent reads the detail file to resume
5. When all sub-tasks done, main task is complete

## Context Window Discipline

After compaction, agent reads only:
- `MANIFEST.md` (~25 lines)
- `SCOPE.md` (~15 lines)
- `QUEUE.md` (~20 lines)
- `INBOX.md` (~10 lines, only active instructions remain)
- `QA.md` (~20 lines, only active conversation)
- `STATUS.md` (~20 lines)

**Total: ~110 lines.** No bloat. Completed items vanish or move to archives.

## The Loop Rules (in MANIFEST.md)

1. **NEVER STOP** — if QUEUE is empty, run self-audit and generate tasks
2. **NEVER ask the user directly** — use QA.md
3. **Complete EVERY task** — no skipping, no laziness, no deferring
4. **HIGH PRIORITY first** — check INBOX.md HIGH PRIORITY every cycle
5. **QUEUED instructions** — one at a time, removed after completion
6. **Problems vanish** — removed from QUEUE when verified fixed
7. **General tasks archived** — moved to COMPLETED.md when done
8. **STATUS.md overwritten** — never appended, never grows
9. **If stuck** for 5+ cycles — write blocker to QA.md, move on
10. **Self-audit** every 10 idle cycles — no limit on generated tasks

## Nested Loops

Any task in QUEUE.md can target a different project. The agent:
1. Pushes current state to its return stack
2. Enters the target project
3. Initializes `.loop/` there if missing
4. Processes that project's QUEUE.md
5. Returns to parent project when done

Depth is unlimited. The agent manages the return stack automatically.

## Anti-Laziness

The system is designed to prevent agents from skipping hard work. If a task says "rewrite this 50k LOC TypeScript project in Rust" — the agent does it. No skipping, no complaining, no "this is good enough."

## Customization

All templates are in the CLI's `templates/` directory. Edit them to change behavior across all projects. Re-run `npm link` to apply changes.

## License

MIT
