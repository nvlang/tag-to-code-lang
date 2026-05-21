---
'@nvl/tag-to-code-lang': patch
---

Reduce shipped bundle by ~43% (17 KB minified, 8.3 KB gzip) by storing the language table as a compact tab-delimited string parsed once at module load. Public API unchanged. Also syncs the latest upstream linguist data.
