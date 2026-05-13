---
name: feedback-no-restore-removed-code
description: Never rewrite or restore code the user has removed from the file
metadata:
  type: feedback
---

Do not rewrite or restore code that the user has deleted from a file. If the current file doesn't match a previously known version, work only with what exists in the file now.

**Why:** The user intentionally removed the code. Restoring it ignores their edits and causes conflicts.

**How to apply:** Always read the actual current file state before editing. If a string isn't found, re-read the file and edit only what's there — never add back removed sections unless explicitly asked.
