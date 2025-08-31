export function arkaUrl() {
  // Support both server and client-side environment variables
  const key = process.env.ARKA_API_KEY || process.env.NEXT_PUBLIC_ARKA_API_KEY;
  const cid = process.env.ARKA_CHAIN_ID || process.env.NEXT_PUBLIC_ARKA_CHAIN_ID || "44787";
  
  if (!key) {
    console.error("Missing ARKA_API_KEY - available env vars:", {
      server: process.env.ARKA_API_KEY ? 'set' : 'missing',
      client: process.env.NEXT_PUBLIC_ARKA_API_KEY ? 'set' : 'missing'
    });
    throw new Error("ARKA_API_KEY not found in environment variables");
  }
  
  // Correct Arka endpoint format for JSON-RPC calls
  const url = `https://rpc.etherspot.io/v1/${cid}?api-key=${key}`;
  console.log("Generated Arka URL (API key hidden):", url.replace(key, '***'));
  return url;
}
