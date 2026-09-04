import * as hre from "hardhat";

const ethers = hre.ethers;

async function main() {
    const registry = await ethers.getContractAt(
        "AegisIDRegistry",
        "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );

    const result = await registry.getCredential(
        "0x01766b5d445e68b433c54b7f511d2579d5e253a39d8889be3b9da0b6fcc210e6"
    );

    console.log("Credential result:");
    console.log(result);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});