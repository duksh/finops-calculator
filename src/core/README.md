# Core Runtime (Extraction Target)

This folder is reserved for extracted core runtime logic from `index.html`.

Initial modularization strategy is:

1. Move pure functions first (no DOM access)
2. Keep compatibility adapters in `index.html` until parity is proven
3. Incrementally route callers to extracted modules

No runtime behavior changes are introduced yet by this folder.
