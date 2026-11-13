; Neovim's indent-query convention (@indent.begin/@indent.end), per
; tree-sitter-phh/queries/indents.scm's own convention note: Zed's own
; indents.scm (tree-sitter-ohh is also consumed there) uses @indent/@end
; instead and is NOT interchangeable with this file, see
; zed-ohh/languages/ohh/indents.scm once that package exists
; (the OHH editor-support plan Section 7).

(object "{" @indent.begin "}" @indent.end)
(array "[" @indent.begin "]" @indent.end)
