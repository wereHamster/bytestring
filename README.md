# bytestring

The `bytestring` package provides functions for manipulating byte strings (~
arrays of octets, Uint8Array in modern JavaScript).

Code for each binary-to-text data encoding scheme is placed into a separate module.
Currently the following modules are available:

- `bytestring/base58`

## Getting Started

The package is available via npmjs.org.
Install it with your favourite package manager (npm, pnpm, yarn, …).

```bash
pnpm add bytestring
```

Below is an example of how to use the `base58` module to encode and decode data.
Because the function names are not unique across modules, it is recommended to use a qualified module import.

Tip: use [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) and [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder) to convert between string and Uint8Array.

```typescript
import * as base58 from 'bytestring/base58';

// Assume you have some binary data.
let someBinaryData = new Uint8Array([ /* …  */ ]);

// Encoded with base58 scheme gives you a (longer) string.
const encodedString = base58.encode(someBinaryData);

// Now you can show the string to the user, send in an email etc.
console.log('Base58:', encodedString);
```

## Project Management

This project is managed on GitHub.
Use GitHub Issues for bug reports and feature requests.
Pull requests are welcome.

## Publishing

The `bytestring` package is automatically published to [npmjs.org](https://www.npmjs.com/package/bytestring) upon the creation of a new release on GitHub.

## References

- https://en.wikipedia.org/wiki/Binary-to-text_encoding
