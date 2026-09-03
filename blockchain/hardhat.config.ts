import { defineConfig } from "hardhat/config";
import hardhatIgnition from "@nomicfoundation/hardhat-ignition";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";

export default defineConfig({
  plugins: [
    hardhatIgnition,
    hardhatEthers,
  ],

  solidity: {
    version: "0.8.34",
  },
});