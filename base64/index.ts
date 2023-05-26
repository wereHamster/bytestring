
declare const Buffer: any
declare const atob: any
declare const btoa: any

export function encode(input: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    // Node.js
    return Buffer.from(input).toString('base64');
  } else if (typeof btoa !== 'undefined') {
    // Browsers
    let binary = '';
    const bytes = new Uint8Array(input);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } else {
    throw new Error('Base64 encoding not supported in this environment.');
  }
}

export function decode(output: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    // Node.js
    const buffer = Buffer.from(output, 'base64');
    return new Uint8Array(buffer);
  } else if (typeof atob !== 'undefined') {
    // Browsers
    const binary = atob(output);
    const length = binary.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } else {
    throw new Error('Base64 decoding not supported in this environment.');
  }
}
