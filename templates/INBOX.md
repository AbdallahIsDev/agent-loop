# Inbox

## HIGH PRIORITY
Agent checks this FIRST every cycle. Drop everything and execute immediately.
After execution, remove the instruction from this section.

(empty)

---

## QUEUED INSTRUCTIONS
Agent processes top-to-bottom. Execute the first instruction.
After completion, remove it from the file. Next cycle, next instruction becomes first.

(empty)

---

## Instruction Format

```
### I001 — Short instruction summary
**Added:** (timestamp or cycle)
**Instruction:**
The actual instruction text.

**Executed:** (cycle number, filled after execution, then entire entry removed)
```
