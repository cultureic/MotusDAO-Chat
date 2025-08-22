export const TREASURY = '0xf229F3Dcea3D7cd3cA5ca41C4C50135D7b37F2b9';
export const PRICE_PER_MESSAGE_USER = Number(process.env.PRICE_PER_MESSAGE_USER || '0.002');
export const PRICE_PER_MESSAGE_PRO = Number(process.env.PRICE_PER_MESSAGE_PRO || '0.002');
export const CUSD = {
  alfajores: process.env.CUSD_ADDRESS_ALFAJORES || '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
  mainnet: process.env.CUSD_ADDRESS_MAINNET || '0x765DE816845861e75A25fCA122bb6898B8B1282a'
};
