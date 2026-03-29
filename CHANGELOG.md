# Change Log

All notable changes to the "vishiri-theme" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.1.0] - 2026-03-29

### Added
- Added support for editor elements styling (VScode and Cursor)
- Added support for Markdown styling
- Added a PHP self scope-resolution grammar injection (`syntaxes/php-self-scope-resolution.tmLanguage.json`) to enable dedicated theming for `self::`.
- Added targeted token-color overrides for:
  - SCSS/CSS media types (for example `screen`, `print`).
  - SassDoc tags/types/braces in `@param` comments.
  - TypeScript generic type parameters.
  - JS/TS accessor punctuation (`.` and `?.`).
  - JS/TS `undefined` literals.
  - HTML entities (named/numeric + entity punctuation).
  - PHP namespace/use keywords, namespace separators, imported classes, enum type names, inherited class/interface names, `abstract`/`final`, `?` operators, and heredoc/nowdoc opener punctuation.
  - PHP native function families (including `support.function.*` matches such as `explode`).

### Updated
- Refined JS/TS native vs non-native function coloring:
  - Built-in/default-library functions and methods use mint.
  - User-defined/custom function and method calls remain steel-blue.
- Refined PHP namespace coloring behavior:
  - `namespace` / `use` keywords and `\` separators are red.
  - Namespace path text is steel-blue.
  - Imported class names in `use` statements are white.
- Updated semantic + TextMate rules so TS generics (`T`, `K`, `E`, etc.) resolve to lavender consistently.

## [1.0.2] - 2026-03-28

### Updated
- Missclick on update theme... lol

## [1.0.1] - 2026-03-28

### Updated
- Adjusted compatibility version in package.json

## [1.0.0] - 2026-03-28
 
### Added
 - First release of the theme
 - Added support for TS
 - Added support for JS
 - Added support for CSS
 - Added support for SASS
 - Added support for VUE
 - Added support for PHP
 - Added support for HTML
 - Added support for MD, JSON and similar files
 - Added overall color identity, theme and scheme
 - Added logo, license, name and similar functionality