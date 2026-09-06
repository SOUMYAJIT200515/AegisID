import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AegisIDRegistryModule = buildModule("AegisIDRegistryModule", (m) => {

  const registry = m.contract("AegisIDRegistry");

  return {
    registry,
  };
});

export default AegisIDRegistryModule;