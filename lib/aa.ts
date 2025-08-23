import { ArkaSponsor } from "@/services/gasSponsor";
import { arkaUrl } from "@/lib/arka";

export function getSponsor() {
  if (process.env.GAS_SPONSORED_ENABLED !== "true") throw new Error("AA sponsor disabled");
  return new ArkaSponsor(arkaUrl());
}
