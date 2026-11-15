# tree-sitter-ohh

Tree-sitter grammar for OHH (Open Hand History), a JSON-based hand-history
format. See `grammar.js`'s file header for why this cannot just be a
generic JSON grammar: a multi-hand `.ohh` file is several `{"ohh": ...}`
objects separated by a blank line, which the OHH storage spec says
explicitly "will not be a valid JSON structure" overall, so the document
root here is "one or more top-level values," not "exactly one."
