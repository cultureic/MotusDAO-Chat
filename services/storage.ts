export async function encryptMessage(text: string): Promise<{ ciphertext: Uint8Array; envelope: any }> {
  // TODO: AES-GCM and Lit envelope
  return { ciphertext: new TextEncoder().encode(text), envelope: {} };
}

export async function uploadCiphertext(_ciphertext: Uint8Array): Promise<string> {
  // TODO: Lighthouse upload, return CID
  return 'bafy...';
}
