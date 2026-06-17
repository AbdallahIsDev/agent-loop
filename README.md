# Workspace Manager CLI

Scaffold a `.workspace/` folder for AI-assisted project management.

## Install

```bash
git clone https://github.com/yourusername/workspace-cli.git
cd workspace-cli
```

Then run:

```bash
ws init              # scaffold in current dir
ws init --path C:\path\to\project  # scaffold elsewhere
```

First `ws init` installs globally to `~/.workspace-cli/` and adds to PATH. After that, `ws` works from any directory.

Cross-platform. One clone. One setup. Zero dependencies beyond Node.js.

## How It Works

1. Run `ws init` in your project directory
2. A `.workspace/` folder is created with management files
3. A `README.ws.md` is created with a prompt you can paste to your AI assistant
4. The AI reads the files in `.workspace/` to understand the project and pending work
5. Work is tracked through the todo list — items are processed top to bottom

## The Files

| File | Read Every Session | Purpose |
|------|-------------------|---------|
| briefing.md | Yes | Role reminder, quality standards — read after context refresh |
| guide.md | Yes | Workflow rules, file update procedures |
| boundaries.md | Yes | Project scope, what's in and out |
| todo.md | Yes | Open items with status, priority, type |
| inbox.md | Yes | Urgent items that need immediate attention |
| notes.md | Yes | Current position and context (under 2000 words) |
| status.md | Yes | Activity tracker, progress, health metrics |
| questions.md | Yes | Two-way Q&A between user and the AI |
| done.md | No | Archive of completed items |
| decisions.md | No | Architecture decisions log (append only) |

## Item Lifecycle

| Type | When Complete | Why |
|------|--------------|-----|
| Problem/Bug | Removed from todo.md | Verified fixed, tested, reviewed. Gone. |
| General Task | Moved to done.md | Archived for reference. Todo stays lean. |
| Large Task | Detail file in tasks/ | Sub-tasks tracked individually. |

## Key Features

- **Context Recovery** — notes.md is rewritten every round. After any context refresh, the AI reads it first and recovers its position.
- **Single Active Item** — Only one item ACTIVE at a time. Focus on completion.
- **Self-Review** — After every implementation: verify behavior, architecture fit, hidden risks. Fix before moving on.
- **Structured Q&A** — Questions have IDs, expiry rounds, priority levels, and context.
- **Memory Management** — done.md auto-archives at 50+ entries to `.workspace/archive/`.
- **Scope Tracking** — boundaries.md has structured in-scope/out-of-scope sections plus a drift log.

## Inbox System

- **Urgent Items** — AI handles immediately. Use for "pause current task", "fix this critical bug now".
- **Queued Instructions** — Processed one at a time. AI takes first, completes it, removes it.

## Quality Standards

- No scaffolding — never fake implementations, placeholders, or hacks
- No parallel systems — improve existing architecture
- If you find an improvement — implement it
- Test everything — run tests, verify edge cases, fix failures before marking done

## License

MIT
