require('dotenv').config({ path: ['.env.local', '.env'] });
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: {
    version: '0.8.24',
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    alfajores: {
      url: process.env.NEXT_PUBLIC_ALFAJORES_RPC || '',
      accounts: process.env.DEPLOYER_PK ? [process.env.DEPLOYER_PK] : []
    },
    celo: {
      url: process.env.NEXT_PUBLIC_CELOMAINNET_RPC || '',
      accounts: process.env.DEPLOYER_PK ? [process.env.DEPLOYER_PK] : []
    }
  }
};
