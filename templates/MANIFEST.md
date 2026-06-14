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
13. **Self-audit** runs every 10 idle cycles. No limit on tasks generated.
14. **If stuck** on same task for 5+ cycles → write blocker to QA.md, move to next task.
