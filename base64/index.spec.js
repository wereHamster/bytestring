import test from "ava";
import * as fc from "fast-check";
import { decode, encode } from "./index.js";

const stringTestVectors = [
  ["", ""],
  ["Hello World!", "SGVsbG8gV29ybGQh"],
  [
    "The quick brown fox jumps over the lazy dog.",
    "VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=",
  ],
];

test("base64: encode", (t) => {
  for (const [string, expected] of stringTestVectors) {
    const input = new TextEncoder().encode(string);
    t.is(encode(input), expected, string);
  }
});

test("base64: decode", (t) => {
  for (const [expected, input] of stringTestVectors) {
    const string = new TextDecoder().decode(decode(input));
    t.is(string, expected, input);
  }
});

test("base64: roundtrip (decode . encode === id)", (t) => {
  function roundtrip(bs) {
    t.deepEqual(new Uint8Array(bs), decode(encode(bs)));
  }

  // Input: random Uint8Array.
  fc.assert(fc.property(fc.uint8Array(), roundtrip));

  // Input: arrays of arbitrary length filled with constant octets.
  fc.assert(fc.property(fc.array(fc.constant(0x00)), roundtrip));
  fc.assert(fc.property(fc.array(fc.constant(0xff)), roundtrip));
});

test("base64: roundtrip (encode . decode === id)", (t) => {
  const arbInput = fc.uint8Array().map(encode);

  function roundtrip(str) {
    t.deepEqual(str, encode(decode(str)));
  }

  // Input: random string.
  fc.assert(fc.property(arbInput, roundtrip));
});
