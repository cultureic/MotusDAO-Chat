"use client";

import dynamic from "next/dynamic";

const DNABoxesBackground = dynamic(() => import("@/components/three/DNABoxes"), { ssr: false });

export default function ClientDNABackground() {
  return <DNABoxesBackground />;
}


