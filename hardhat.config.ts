import * as dotenv from "dotenv";
import { HardhatUserConfig, subtask } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
require("@nomiclabs/hardhat-etherscan");

import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from "hardhat/builtin-tasks/task-names";

dotenv.config();

// Filter Reference Contracts
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(
  async (_, __, runSuper) => {
    const paths = await runSuper();

    return paths.filter((p: any) => !p.includes("contracts/reference/"));
  }
);

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: any = {
  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 19066,
          },
        },
      },
    ],
    overrides: {
      "contracts/conduit/Conduit.sol": {
        version: "0.8.14",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/conduit/ConduitController.sol": {
        version: "0.8.14",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      optimisticKovan: process.env.OPTIMISM_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGON_API_KEY,
      // cronosTestnet: process.env.CRONOS_API_KEY,
    },
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.WALLET_PRIVATE_KEY!].filter(Boolean),
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: process.env.MNEMONIC
        ? { mnemonic: process.env.MNEMONIC }
        : [process.env.WALLET_PRIVATE_KEY!].filter(Boolean),
    },
    optimisticKovan: {
      url: `https://opt-kovan.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts: process.env.MNEMONIC
        ? { mnemonic: process.env.MNEMONIC }
        : [process.env.WALLET_PRIVATE_KEY!].filter(Boolean),
    },
    polygonMumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts: process.env.MNEMONIC
        ? { mnemonic: process.env.MNEMONIC }
        : [process.env.WALLET_PRIVATE_KEY!].filter(Boolean),
    },
    cronosTestnet: {
      chainId: 338,
      // url: `https://cro-croeseid.g.alchemy.com/${process.env.ALCHEMY_KEY_CRONOS}/cosmos-rest/`,
      url: 'https://evm-t3.cronos.org',
      accounts: process.env.MNEMONIC
        ? { mnemonic: process.env.MNEMONIC }
        : [process.env.WALLET_PRIVATE_KEY!].filter(Boolean),
    },
    bobaTestnet: {
      chainId: 28,
      url: 'https://rinkeby.boba.network',
      accounts: process.env.MNEMONIC
        ? { mnemonic: process.env.MNEMONIC }
        : [process.env.WALLET_PRIVATE_KEY!].filter(Boolean),
    },
    hardhat: {
      blockGasLimit: 30_000_000,
      throwOnCallFailures: false,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  // specify separate cache for hardhat, since it could possibly conflict with foundry's
  paths: { cache: "hh-cache" },
};

export default config;
