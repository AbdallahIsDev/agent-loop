# Task Queue

## Rules
- **Problems/bugs** → remove when verified fixed + tested + reviewed (never re-read).
- **General tasks** → move to COMPLETED.md when done (archived, not lost).
- **Big tasks** → create `.loop/tasks/<id>-details.md` for sub-tasks. The QUEUE entry stays clean; the detail file holds the breakdown + working memory.
- **Cross-project tasks** → agent enters nested loop in target project, returns when done.
- Order: top = highest priority.

---

## PENDING
(no pending tasks)

## IN PROGRESS
(no active task)

## WAITING
Blocked tasks waiting on external things (user answer, API key, etc.)

---

## Task Format Example
Each task entry follows this structure:

```
### Q001 — Task title
**Status:** PENDING / IN_PROGRESS / WAITING
**Priority:** High / Medium / Low
**Project:** (optional — if different from current project)
**Details:**
Description of what needs to be done.

**Solution (optional — do not trust blindly):**
Pre-written fix instructions, if any.
Agent must brainstorm and verify this is the best solution.
If your solution is better, use yours. If documented solution is best, apply it.
```
