export function encode(input: Uint8Array): string {
  return Buffer.from(input).toString("base64");
}

export function decode(output: string): Uint8Array {
  return Buffer.from(output, "base64");
}
