# tree-sitter-ohh

Tree-sitter grammar for OHH (Open Hand History), a JSON-based hand-history
format. See `grammar.js`'s file header for why this cannot just be a
generic JSON grammar: a multi-hand `.ohh` file is several `{"ohh": ...}`
objects separated by a blank line, which the OHH storage spec says
explicitly "will not be a valid JSON structure" overall, so the document
root here is "one or more top-level values," not "exactly one."

## Status

Generates cleanly with `tree-sitter generate` and parses the full corpus
at `../ohh/corpus/` with **zero `ERROR` nodes**, including all three
`invalid/` fixtures, which is correct: they are semantically invalid
(bad enum value, an illegal bet in preflop, a missing required field),
not syntactically invalid. As with PHH, L0 (grammar) and L1 (registry-
driven semantic checks, via `ohh-ls`) are deliberately separate layers.

Covers: objects, arrays, strings (with escape sequences), numbers,
`true`/`false`/`null`, and the blank-line-tolerant multi-hand document
root described above. No OHH-specific field or enum structure is baked
into the grammar itself (`ohh/registry/fields.json`,
`ohh/registry/enums.json` are the source of truth there); the grammar
only has to know JSON's shape, and that more than one top-level object
is allowed.

## Queries (`queries/`)

| File | Purpose | Validated how |
|---|---|---|
| `highlights.scm` | Punctuation, literals, and a text-matched special case for well-known enum-valued keys (`game_type`, `bet_type`, `street`, `action`) | `tree-sitter query` against the corpus |
| `folds.scm` | Fold any object or array body | `tree-sitter query` against the corpus |
| `indents.scm` | Indent inside objects/arrays, Neovim's `@indent.begin`/`@indent.end` convention; Zed wants a different convention (`@indent`/`@end`) for the same purpose, see `zed-ohh/languages/ohh/indents.scm`, not interchangeable with this file | `tree-sitter query` against the corpus |
| `outline.scm` | One outline entry per hand, keyed by that hand's own `game_number`, never assumed to be the first/only hand in the file | `tree-sitter query` against both single- and multi-hand fixtures. **Not validated against a live Zed install**, matches Zed's documented `@item`/`@name` convention but confirm before shipping |

The enum-valued-key special case in `highlights.scm` and `ohh-ls`'s own
hover/completion both read `ohh/registry/enums.json`, but as two separate
copies of the same facts: a tree-sitter query can't read JSON at runtime,
so grammar-level highlighting and server-level semantics agree by having
each been checked against the registry, not by one depending on the
other.
