const hre = require("hardhat");

async function main() {
  const SnapshotProxy = await hre.ethers.getContractFactory("SnapshotProxy");
  const snapshotProxyContract = await SnapshotProxy.deploy();

  await snapshotProxyContract.deployed();

  console.log("snapshotProxyContract deployed to:", snapshotProxyContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
