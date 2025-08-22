import { cache } from 'react';

export const HUMAN_VERIFIED = '0x' as const;
export const VERIFIED_PSYCHOLOGIST = '0x' as const;

export const hasTrait = cache(async (_tokenId: string, _traitId: string): Promise<boolean> => {
  // TODO: viem read from TraitAttestor
  return true;
});
