const hre = require("hardhat");

async function main() {
  const VoteProxy = await hre.ethers.getContractFactory("VoteProxy");
  const voteProxyContract = await VoteProxy.deploy();

  await voteProxyContract.deployed();

  console.log("voteProxyContract deployed to:", voteProxyContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
