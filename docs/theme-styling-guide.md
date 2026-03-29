# Vishiri Theme — styling rules of thumb

This document describes **what each color role means** in the Vishiri color theme so future tweaks stay consistent. It reflects how **`themes/Vishiri Theme-color-theme.json`** is organized, plus **semantic highlighting** (`semanticHighlighting` / `semanticTokenColors`).

---

## 1. Core roles (palette by meaning)

| Role | Typical hex | Font | Meaning |
|------|-------------|------|---------|
| **Editor text** | `#f3eee8` / `#f4eee7` | normal | Default foreground (`editor.foreground`, variables, plain identifiers). |
| **Control & syntax keywords** | `#d16f7c` | often *italic* | Flow and structural keywords (`if`, `return`, `function` where scoped as storage/keyword, `class`, modifiers like `extends` / `implements` when given explicit PHP scopes, etc.). |
| **Types & type-ish syntax** | `#bca9e8` | often *italic* | TS/JS primitives, interfaces, annotations; PHP `keyword.other.type.php` and type parens for casts/unions (`punctuation.definition.type.*.php`, not `*.phpdoc.php`). |
| **Operators & punctuation (code)** | `#9fb8d4` | normal | `===`, `??`, `.`, `->`, `::` (where scoped as operators), TS/JS operator scopes, etc. |
| **Strings & “literal” feel** | `#e6c37e` | normal | String literals, many numeric constants, gold accent family. |
| **Parameters (semantic)** | `#f2dfba` | normal | `semanticTokenColors.parameter` — hints and parameters read as “soft peach”. |
| **Properties (semantic)** | `#dad1ca` | *italic* | `semanticTokenColors.property` — member access / keys. |
| **Comments** | `#9b7768` | *italic* | Recede from code. |
| **Mint — library / builtin (semantic)** | `#96ccb9` | normal | `function.defaultLibrary`, `method.defaultLibrary`, `variable.defaultLibrary`, `class.defaultLibrary`, etc. |
| **Steel-blue — user calls (semantic)** | `#b3c8dd` | normal | `function` / `method` (non-declaration) — “userland” call sites. |
| **Bright name — declarations (semantic)** | `#f6f0ea` | normal | `function.declaration`, `method.declaration` — the name being defined. |

**Rule of thumb:** *Red = structure / control · Lavender = types · Mint = “known library” from semantics · Steel = your calls · Gold = literals · Peach = parameters.*

---

## 2. PHP-specific 

**Visual map (mixed template):**

| What you see | Intended role | Notes |
|--------------|---------------|--------|
| `<?php`, `?>`, `<?=` | Lavender tag wrapper | Separates PHP from HTML. |
| `$variables` | Cream / white | Same family as default code text. |
| `if`, `return`, `class`, … | Salmon / red, often italic | Control and structural keywords. |
| String literals `'…'` / `"…"` | Gold | Distinct from markup and types. |
| Builtin / native calls (`implode`, `empty`, …) | Mint | `support.function.php`, `support.function.construct.php`. |
| SQL-ish keywords in strings, casts, `??` | See dedicated `tokenColors` rules | e.g. red keywords inside embedded SQL, lavender for type casts where scoped. |
| HTML tag names (`div`, `a`) | Teal / mint (HTML grammar) | Comes from HTML scopes, not PHP. |
| HTML attribute names | Often gold or string-like | HTML TextMate scopes. |
| Grey italic “field-like” names in SQL strings | Targeted scopes | When grammar exposes them (e.g. quoted identifiers). |

**Rules of thumb:**

- **Top-of-file PHP:** `support.function.php` and `support.function.construct.php` are **mint** (`#96ccb9`) — builtins and constructs like `empty` / `isset` sit with normal calls, not with red keywords.
- **Variables** (`variable.other.php`, …): **cream/white** (`#f4eee7`).
- **`<?php`, `?>`, `<?=` delimiters:** **lavender** (`#bca9e8`) — “PHP Tag Wrapper” rule; separates template from markup.
- **Parameter / argument labels** (e.g. `slug:` before a value): often **inlay hints** or similar editor UI. They are **not** always driven by the same `tokenColors` entries as code tokens; tune **`editorInlayHint.*`** in the theme or user settings if you want those labels to match salmon, peach, or grey.
- **Inside HTML:** PHP **functions** in `<?= ... ?>` use the same TextMate scopes as in pure PHP when the tokenizer is in `source.php`. If something looks wrong, use **Developer: Inspect Editor Tokens and Scopes** — usually a **scope** issue, not a missing hex.
- **Embedded JS in PHP:** the document is still **`php`**. **Semantic** TS/JS tokens often **do not** run inside `<script>` there, so globals like `setTimeout` may stay **default text** while `jQuery` / methods may still pick up colors from **TextMate** — expected platform behavior, not a theme bug.

---

## 3. TypeScript / JavaScript

**Visual map (pure TS/JS buffer):**

| What you see | Intended role | Mechanism |
|--------------|---------------|-----------|
| `export`, `const`, `if`, `return`, `function`, … | Salmon / red, often italic | `tokenColors` on `storage.*`, `keyword.control.*`, etc. |
| `function` keyword specifically | Same salmon red | `storage.type.function.ts` / `.tsx` / `.js` / `.js.jsx` under **TS Keywords** / **JS Keywords** — avoids classifying it only as generic lavender `storage.type`. |
| `=>` (fat arrow) | Steel blue | `storage.type.function.arrow.ts` / `.js` live with operator-adjacent scopes in **TS types** / **JS types** (`#9fb8d4`). |
| `void`, `HTMLElement`, primitives | Lavender, often italic | TextMate `support.type.*` and related. |
| `querySelector`, `forEach`, `setInterval`, … | Mint | **Semantic** `function.defaultLibrary` / `method.defaultLibrary`. |
| Your function names at call sites | Steel blue | **Semantic** `function` / `method`. |
| Name in `function foo()` / `const bar = ()` | Brighter foreground | **Semantic** `function.declaration` / `method.declaration`. |
| Parameters / properties | Peach / grey italic | **Semantic** `parameter`, `property` where enabled. |

**Rules of thumb:**

- **`storage.type.function.ts` / `.js` (and JSX/TSX variants)** use **`#d16f7c` italic** under **TS Keywords** / **JS Keywords** so `function` aligns with `const` / `if`, not the broad lavender `storage.type` styling.
- **Primitives / builtins (TextMate):** `support.type.primitive.*`, `support.type.builtin.*` → **lavender italic** (`#bca9e8`).
- **Semantic layer (when language service runs):**
  - **Library methods** (`querySelector`, `forEach`, `setInterval`, …): **mint** via `method.defaultLibrary` / `function.defaultLibrary`.
  - **User-defined function names** at call sites: **steel** `#b3c8dd`.
  - **Declaration names**: **bright** `#f6f0ea`.

**Rule of thumb:** In **pure** `.ts`/`.js`, trust **semantic** colors for “is this stdlib or mine?”. In **PHP** or other mixed files, expect **more TextMate and less semantic** inside embedded regions.

---

## 4. When something “looks wrong”

1. **Inspect scopes** — Command Palette → **Developer: Inspect Editor Tokens and Scopes**.
2. Check whether **semantic** section is filled (TS/JS) or empty (embedded / PHP).
3. Prefer **adding or narrowing `tokenColors` scopes** (language-specific, longer scope names) over broad `keyword` / `storage.type` rules that spill across languages.
4. Theme file is **JSON5-friendly** (comments allowed). After edits, run `npm run organize-theme` if you use the project script to normalize structure.

---

## 5. Related files

| File | Purpose |
|------|---------|
| `themes/Vishiri Theme-color-theme.json` | UI colors, `tokenColors`, `semanticTokenColors`. |
| `scripts/palettes/gilded-crimson.json` | Optional bulk hex remaps (palette tooling). |
| `scripts/Apply-ThemePalette.ps1` | Apply a palette file to the theme. |

---

*Last aligned with theme conventions used for PHP + TS/JS token tuning (control = salmon, types = lavender, library = mint, literals = gold).*
