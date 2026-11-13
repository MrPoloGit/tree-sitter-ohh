// Tree-sitter grammar for OHH (Open Hand History): https://hh-specs.handhistory.org/
// (spec_version 1.4.9, fetched 2026-11-04). See the OHH editor-support plan.
//
// OHH is plain JSON for a single hand, but a `.ohh` file holding several
// hands is NOT one JSON document: the storage spec requires each
// `{"ohh": ...}` object to be separated from the next by exactly one blank
// line, and states outright that the resulting file "will not be a valid
// JSON structure". Generic JSON tooling (including a JSON tree-sitter
// grammar's own root rule) chokes on that. The fix mirrors tree-sitter-phh's
// `.phhs` treatment: the document root is "one or more top-level values",
// not "exactly one value", tree-sitter's `extras` already treats
// whitespace (including blank lines) as insignificant between any two
// tokens, so no grammar rule needs to specifically require or count blank
// lines; it just needs to not forbid more than one top-level object.
//
// This is otherwise a standard JSON grammar (object/array/string/number/
// true/false/null) with no OHH-specific structure baked in at the grammar
// level, OHH's actual field/enum rules (the OHH editor-support plan
// Section 1) are registry data for ohh-ls to check, per StreetScope Section 4.6
// principle 5 ("syntax errors come from the grammar; rule errors come from
// the registry and checker").

module.exports = grammar({
  name: "ohh",

  extras: ($) => [/\s/],

  rules: {
    // Zero-or-more so an empty file isn't a parse error, same leniency
    // tree-sitter-phh's document root gives an empty `.phhs` file.
    document: ($) => repeat($._value),

    _value: ($) =>
      choice(
        $.object,
        $.array,
        $.string,
        $.number,
        $.true,
        $.false,
        $.null,
      ),

    object: ($) =>
      seq(
        "{",
        optional(seq($.pair, repeat(seq(",", $.pair)))),
        "}",
      ),

    pair: ($) => seq(field("key", $.string), ":", field("value", $._value)),

    array: ($) =>
      seq(
        "[",
        optional(seq($._value, repeat(seq(",", $._value)))),
        "]",
      ),

    string: ($) =>
      seq('"', repeat(choice($._string_content, $.escape_sequence)), '"'),

    _string_content: () => token.immediate(prec(1, /[^"\\]+/)),

    escape_sequence: () =>
      token.immediate(
        seq("\\", choice(/["\\/bfnrt]/, /u[0-9a-fA-F]{4}/)),
      ),

    number: () => token(/-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?/),

    true: () => "true",
    false: () => "false",
    null: () => "null",
  },
});
