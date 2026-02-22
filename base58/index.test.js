import assert from "node:assert/strict";
import { test } from "node:test";
import * as fc from "fast-check";
import { decode, encode } from "./index.js";

// https://tools.ietf.org/id/draft-msporny-base58-01.html
const stringTestVectors = [
  ["", ""],
  ["Hello World!", "2NEpo7TZRRrLZSi2U"],
  [
    "The quick brown fox jumps over the lazy dog.",
    "USm3fpXnKG5EUBx2ndxBDMPVciP5hGey2Jh4NDv6gmeo1LkMeiKrLJUUBk6Z",
  ],
];

// https://github.com/bitcoin/bitcoin/blob/master/src/test/data/base58_encode_decode.json
const hexTestVectors = [
  ["61", "2g"],
  ["626262", "a3gV"],
  ["636363", "aPEr"],
  ["73696d706c792061206c6f6e6720737472696e67", "2cFupjhnEsSn59qHXstmK2ffpLv2"],
  [
    "00eb15231dfceb60925886b67d065299925915aeb172c06647",
    "1NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L",
  ],
  ["516b6fcd0f", "ABnLTmg"],
  ["bf4f89001e670274dd", "3SEo3LWLoPntC"],
  ["572e4794", "3EFU7m"],
  ["ecac89cad93923c02321", "EJDM8drfXA6uyA"],
  ["10c8511e", "Rt5zm"],
  // ["00000000000000000000", "1111111111"],
  [
    "000111d38e5fc9071ffcd20b4a763cc9ae4f252bb4e48fd66a835e252ada93ff480d6dd43dc62a641155a5",
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  ],
  [
    "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff",
    "1cWB5HCBdLjAuqGGReWE3R3CguuwSjw6RHn39s2yuDRTS5NsBgNiFpWgAnEx6VQi8csexkgYw3mdYrMHr8x9i7aEwP8kZ7vccXWqKDvGv3u1GxFKPuAkn8JCPPGDMf3vMMnbzm6Nh9zh1gcNsMvH3ZNLmP5fSG6DGbbi2tuwMWPthr4boWwCxf7ewSgNQeacyozhKDDQQ1qL5fQFUW52QKUZDZ5fw3KXNQJMcNTcaB723LchjeKun7MuGW5qyCBZYzA1KjofN1gYBV3NqyhQJ3Ns746GNuf9N2pQPmHz4xpnSrrfCvy6TVVz5d4PdrjeshsWQwpZsZGzvbdAdN8MKV5QsBDY",
  ],
];

test("base58: encode", () => {
  for (const [string, expected] of stringTestVectors) {
    const input = new TextEncoder().encode(string);
    assert.equal(encode(input), expected, string);
  }

  for (const [hex, expected] of hexTestVectors) {
    const input = Uint8Array.from(
      hex.match(/[\da-fA-F]{2}/g).map((h) => parseInt(h, 16)),
    );
    assert.equal(encode(input), expected, hex);
  }
});

test("base58: decode", () => {
  for (const [expected, input] of stringTestVectors) {
    const string = new TextDecoder().decode(decode(input));
    assert.equal(string, expected, input);
  }

  for (const [hex, input] of hexTestVectors) {
    const expected = Uint8Array.from(
      hex.match(/[\da-fA-F]{2}/g).map((h) => parseInt(h, 16)),
    );
    assert.deepEqual(decode(input), expected, input);
  }
});

test("base58: roundtrip (decode . encode === id)", () => {
  function roundtrip(bs) {
    assert.deepEqual(new Uint8Array(bs), decode(encode(bs)));
  }

  // Input: random Uint8Array.
  fc.assert(fc.property(fc.uint8Array(), roundtrip));

  // Input: arrays of arbitrary length filled with constant octets.
  fc.assert(fc.property(fc.array(fc.constant(0x00)), roundtrip));
  fc.assert(fc.property(fc.array(fc.constant(0xff)), roundtrip));
});

test("base58: roundtrip (encode . decode === id)", () => {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const arbInput = fc.string({ unit: fc.constantFrom(...alphabet.split("")) });

  function roundtrip(str) {
    assert.deepEqual(str, encode(decode(str)));
  }

  // Input: random string.
  fc.assert(fc.property(arbInput, roundtrip));

  // Input: strings of arbitrary length filled with constant characters.
  fc.assert(fc.property(fc.string({ unit: fc.constant("1") }), roundtrip));
  fc.assert(fc.property(fc.string({ unit: fc.constant("z") }), roundtrip));
});
