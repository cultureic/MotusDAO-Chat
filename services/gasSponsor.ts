import { createUserOperation } from "@/lib/arka-userop";
import { arkaUrl } from "@/lib/arka";
import { signUserOpHash } from "@/lib/userop-signature";
import { getUserOperationHash, type UserOperation } from "@/lib/userop-hash";

export interface GasSponsor {
  sponsorAndSend(p:{
    userSmartAccount:`0x${string}`; target:`0x${string}`; data:`0x${string}`;
    value?: bigint; chainId:number; privateKey?: `0x${string}`;
    nonce?: string; // Added nonce for explicit control
    feeBumpBps?: number; // Added feeBumpBps for fee bumping
  }): Promise<{ userOpHash: string; txHash?: string; arkaSponsor?: any; message?: string; error?: string }>;
}

export class ArkaSponsor implements GasSponsor {
  constructor(private url: string) {} // URL is now passed from arkaUrl()

  async sponsorAndSend(p:{
    userSmartAccount:`0x${string}`; target:`0x${string}`; data:`0x${string}`;
    value?: bigint; chainId:number; privateKey?: `0x${string}`;
    nonce?: string;
    feeBumpBps?: number;
  }) {
    try {
      console.log('ArkaSponsor: Starting sponsorship for', {
        sender: p.userSmartAccount,
        target: p.target,
        callData: p.data,
        value: p.value?.toString(),
        chainId: p.chainId,
        url: this.url,
        nonce: p.nonce,
        feeBumpBps: p.feeBumpBps
      });

      // Create UserOperation for smart account
      const userOp = await createUserOperation({
        sender: p.userSmartAccount,
        target: p.target,
        callData: p.data,
        value: p.value,
        privateKey: p.privateKey,
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        chainId: p.chainId,
        nonce: p.nonce, // Pass nonce to createUserOperation
        feeBumpBps: p.feeBumpBps // Pass feeBumpBps to createUserOperation
      });

      console.log('ArkaSponsor: Created UserOperation', userOp);

      // Generate proper signature for the UserOperation
      const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" as `0x${string}`;
      const userOpHash = getUserOperationHash(userOp as UserOperation, entryPoint, p.chainId);
      console.log('ArkaSponsor: Generated UserOperation hash:', userOpHash);
      
      const signature = await signUserOpHash(userOpHash);
      console.log('ArkaSponsor: Generated signature, length:', signature.length);
      
      // Update the UserOperation with the proper signature
      userOp.signature = signature;

      // For native CELO sponsorship, we go directly to eth_sendUserOperation
      const sponsorRequest = {
        jsonrpc: "2.0",
        method: "eth_sendUserOperation",
        params: [
          userOp,
          "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" // EntryPoint address
        ],
        id: 1
      };

      console.log('ArkaSponsor: Submitting UserOperation for native CELO sponsorship', {
        request: sponsorRequest,
        url: this.url // Log the URL being used
      });

      const sponsorRes = await fetch(this.url, { // Use this.url which comes from arkaUrl()
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(sponsorRequest),
      });

      console.log('ArkaSponsor: Sponsor response status:', sponsorRes.status);

      if (!sponsorRes.ok) {
        const errorText = await sponsorRes.text();
        console.log('ArkaSponsor: Sponsor response error:', errorText);
        throw new Error(`Arka sponsorship error: ${sponsorRes.status} ${errorText}`);
      }

      const sponsorResponse = await sponsorRes.json();
      console.log('ArkaSponsor: Received sponsorship response', sponsorResponse);

      // Check if we got a valid response
      if (sponsorResponse.error) {
        console.error('ArkaSponsor: Error in response:', sponsorResponse.error);
        throw new Error(`Arka error: ${sponsorResponse.error.message || sponsorResponse.error}`);
      }

      if (!sponsorResponse.result) {
        console.error('ArkaSponsor: No result in response:', sponsorResponse);
        throw new Error('No result from Arka');
      }

      console.log('ArkaSponsor: Result structure:', {
        result: sponsorResponse.result,
        resultType: typeof sponsorResponse.result,
        resultKeys: Object.keys(sponsorResponse.result || {})
      });

      // Return the actual UserOperation hash and transaction hash
      return {
        userOpHash: sponsorResponse.result?.userOpHash || sponsorResponse.result || '0x_no_userop_hash',
        txHash: sponsorResponse.result?.txHash || '0x_no_tx_hash',
        arkaSponsor: sponsorResponse,
        message: 'Arka native CELO sponsorship successful'
      };
    } catch (error: any) {
      console.error('ArkaSponsor error:', error);
      return {
        userOpHash: '0x_error',
        txHash: '0x_error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}