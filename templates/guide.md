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

## Quality Gate

After every meaningful change, ask yourself:

- Did I follow boundaries.md?
- Did I verify the issue is real?
- Is this complete, not scaffolded?
- Is it clean, secure, maintainable?
- Did tests pass?

If any answer is no/unsure → improve first, then proceed.

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
