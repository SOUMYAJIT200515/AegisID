import { network } from "hardhat";

async function main() {
    const { ethers } = await network.connect();

    const registry = await ethers.getContractAt(
        "AegisIDRegistry",
        "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );

    const result = await registry.getAsset(
        "0xbe6527448348a118a697e423c0e657f726645d8ba36febb2172ee8088cb0571d"
    );

    console.log("Asset result:");
    console.log(result);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});