const hre = require("hardhat");

async function main() {
  const PermitProxy = await hre.ethers.getContractFactory("PermitProxy");
  const permitProxyContract = await PermitProxy.deploy();

  await permitProxyContract.deployed();

  console.log("permitProxyContract deployed to:", permitProxyContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
