const fs = require('fs');
const path = require('path');
const hre = require("hardhat");

async function main() {
  const PausibleProxy = await hre.ethers.getContractFactory("PausibleProxy");
  const pausibleProxyContract = await PausibleProxy.deploy();

  await pausibleProxyContract.deployed();

  console.log("pausibleProxyContract deployed to:", pausibleProxyContract.address);

  const content = {
    'pausibleProxyContract' : pausibleProxyContract.address
  }
  createAddressJson(path.join(__dirname, '/../web/address.json'),JSON.stringify(content))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function createAddressJson(path,content){
  try{
    fs.writeFileSync(path,content)
    console.log("Created Contract Address JSON")
  } catch (err) {
    console.error(err)
    return
  }
}
