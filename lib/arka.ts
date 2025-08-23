export function arkaUrl() {
  const key = process.env.ARKA_API_KEY!;
  const cid = process.env.ARKA_CHAIN_ID || "44787";
  // Correct Arka endpoint format for JSON-RPC calls
  return `https://rpc.etherspot.io/v1/${cid}?api-key=${key}`;
}