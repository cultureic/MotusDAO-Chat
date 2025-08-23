import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

/** Sign the raw userOpHash (bytes32) and return 65-byte r||s||v hex.
 *  - Uses SA_OWNER_PRIVATE_KEY from env
 *  - Normalizes v to 27/28 if a client returns 0/1
 */
export async function signUserOpHash(userOpHash: Hex): Promise<Hex> {
  const pk = process.env.SA_OWNER_PRIVATE_KEY as Hex | undefined;
  if (!pk) throw new Error("SA_OWNER_PRIVATE_KEY is missing");

  const account = privateKeyToAccount(pk);

  // viem will produce a 65-byte signature (0x + 130 hex)
  // `raw` ensures we're signing the exact bytes, not UTF-8 string
  let sig = await account.signMessage({ message: { raw: userOpHash } });

  // Normalize v → 27/28 (some SAs require this)
  // sig = 0x + 64 bytes r (128 hex) + 32 bytes s (64 hex)? No: r(32) + s(32) + v(1) => total 65 bytes = 130 hex after 0x.
  // The last 1 byte (2 hex chars) is v.
  if (sig.length !== 132) throw new Error(`Bad signature length: ${sig.length} (expected 132)`);
  const vHex = sig.slice(130, 132);
  const v = parseInt(vHex, 16);
  if (v === 0 || v === 1) {
    const v27 = (v + 27).toString(16).padStart(2, "0");
    sig = (sig.slice(0, 130) + v27) as Hex;
  }
  return sig as Hex;
}
