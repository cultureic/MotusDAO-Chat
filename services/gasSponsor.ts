export interface GasSponsor {
  sponsorAndSend(params: { userSmartAccount: string; target: string; data: `0x${string}`; chainId: number; }): Promise<{ userOpHash: string; txHash?: string }>;
}

export class DummySponsor implements GasSponsor {
  async sponsorAndSend(): Promise<{ userOpHash: string; txHash?: string }> {
    return { userOpHash: '0x_dummy', txHash: undefined };
  }
}
