# Task Queue

## Rules
- **Problems/bugs** → remove when verified fixed + tested + reviewed (never re-read).
- **General tasks** → move to COMPLETED.md when done (archived, not lost).
- **Big tasks** → create `.loop/tasks/<id>-details.md` for sub-tasks.
- **Cross-project tasks** → agent enters nested loop in target project, returns when done.
- **Only ONE task IN_PROGRESS at a time.**
- **State transitions must follow MANIFEST.md Task State Machine.**
- Order: top = highest priority.

---

## PENDING
(no pending tasks)

## IN PROGRESS
(no active task)

## WAITING
Blocked tasks — each MUST specify its blocker.

(no blocked tasks)

## FAILED
Tasks that failed — can be retried by moving back to PENDING.

(no failed tasks)

---

## Task Format

```
### Q001 — Task title
**Status:** PENDING | IN_PROGRESS | WAITING | FAILED
**Priority:** High | Medium | Low
**Type:** Problem | General | Big
**Depends On:** (task IDs, or "none")
**Git Task:** Yes | No
**Details:**
Description of what needs to be done.

**Solution (optional — do not trust blindly):**
Pre-written fix instructions, if any.
Agent must brainstorm and verify this is the best solution.

**State History:**
- [cycle] PENDING → IN_PROGRESS
```
