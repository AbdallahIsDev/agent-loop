# Task Queue

## Rules
- **Problems/bugs** → remove when verified fixed + tested + reviewed (never re-read).
- **General tasks** → move to COMPLETED.md when done (archived, not lost).
- **Big tasks** → create `.loop/tasks/<id>-details.md` for sub-tasks.
- **Cross-project tasks** → agent enters nested loop in target project, returns when done.
- **Only ONE task IN_PROGRESS at a time.**
- Order: top = highest priority.

---

(no tasks yet)

---

## Task Format
Each entry uses this structure. Status is a field, not a section.

```
### Q001 — Task title
**Status:** PENDING | IN_PROGRESS | WAITING | FAILED
**Priority:** High | Medium | Low
**Type:** Problem | General | Big
**Details:**
Description of what needs to be done.

**Solution (optional — do not trust blindly):**
Pre-written fix instructions, if any.
Agent must brainstorm and verify this is the best solution.

**State History:**
- [cycle] PENDING → IN_PROGRESS
```
