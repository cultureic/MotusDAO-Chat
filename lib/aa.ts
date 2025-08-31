import { ArkaSponsor } from "@/services/gasSponsor";
import { arkaUrl } from "@/lib/arka";

export function getSponsor() {
  // Check both server and client-side environment variables
  const gasSponsored = process.env.GAS_SPONSORED_ENABLED === "true" || 
                       process.env.NEXT_PUBLIC_GAS_SPONSORED_ENABLED === "true";
  
  if (!gasSponsored) {
    console.error("AA sponsor check failed:", {
      serverSide: process.env.GAS_SPONSORED_ENABLED,
      clientSide: process.env.NEXT_PUBLIC_GAS_SPONSORED_ENABLED,
      nodeEnv: process.env.NODE_ENV
    });
    throw new Error("AA sponsor disabled - Please check GAS_SPONSORED_ENABLED environment variable");
  }
  
  try {
    const url = arkaUrl();
    console.log("AA sponsor enabled, creating ArkaSponsor with URL:", url.replace(/api-key=[^&]+/, 'api-key=***'));
    return new ArkaSponsor(url);
  } catch (error: any) {
    console.error("Failed to create Arka sponsor:", error);
    throw new Error(`AA sponsor setup failed: ${error.message}`);
  }
}
