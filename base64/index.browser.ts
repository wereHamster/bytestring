export function encode(input: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < input.length; i++) {
    binary += String.fromCharCode(input[i]);
  }
  return btoa(binary);
}

export function decode(output: string): Uint8Array {
  const binary = atob(output);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
