import { NextRequest } from 'next/server';
import { signUserOpHash } from "@/lib/userop-signature";

export async function GET(req: NextRequest) {
  try {
    // Test with a simple hash
    const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" as `0x${string}`;
    
    console.log('Testing signature generation with hash:', testHash);
    
    const signature = await signUserOpHash(testHash);
    
    console.log('Generated signature:', signature);
    console.log('Signature length:', signature.length);
    
    return Response.json({ 
      success: true,
      testHash,
      signature,
      signatureLength: signature.length,
      message: 'Signature generation test successful'
    });
  } catch (error: any) {
    console.error('Signature test error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5)
    }, { status: 500 });
  }
}
