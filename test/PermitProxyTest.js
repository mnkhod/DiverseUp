const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PermitProxy Test", function () {
  var owner,odko,amaraa;
  var mockTokenContract;
  var permitProxyContract;
  var oldTokenAddress,newTokenAddress,exchangeAddress;

  var exchangeContract,newTokenContract;

  const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000" 
  const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"))

  beforeEach(async function () {
    [owner,odko,amaraa] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockToken");
    mockTokenContract = await MockToken.deploy();
    await mockTokenContract.deployed();

    const PermitProxy = await ethers.getContractFactory("PermitProxy");
    permitProxyContract = await PermitProxy.deploy();
    await permitProxyContract.deployed();

    // Creating Permit v2 Contracts
    let result = await ((await permitProxyContract.connect(odko).updateToken(
      mockTokenContract.address,
      "MockTokenV2",
      "MTNv2",
      odko.address
    )).wait())

    let updatedTokenEvent = result.events.find((i) => i.event == "UpdatedToken")
    if(updatedTokenEvent == null) throw Error("UpdatedToken Event Not Found")

    oldTokenAddress = updatedTokenEvent.args.oldToken
    newTokenAddress = updatedTokenEvent.args.newToken
    exchangeAddress = updatedTokenEvent.args.exchange

    exchangeContract = await ethers.getContractAt('TokenExchange',exchangeAddress) 
    newTokenContract = await ethers.getContractAt('PermitToken',newTokenAddress) 

    expect(await newTokenContract.name()).to.equal("MockTokenV2");
    expect(await newTokenContract.symbol()).to.equal("MTNv2");

    expect(await exchangeContract.hasRole(ADMIN_ROLE,odko.address)).to.equal(true);

    expect(await exchangeContract.hasRole(ADMIN_ROLE,permitProxyContract.address)).to.equal(true);
    expect(await newTokenContract.hasRole(ADMIN_ROLE,permitProxyContract.address)).to.equal(true);
  });

  it("Exchange - Deposit Test", async function () {
    // Sending 1000 Mock Tokens to Amaraa User
    let tokenAmount = ethers.utils.parseUnits('1000',18)
    await mockTokenContract.transfer(amaraa.address,tokenAmount)

    expect(await mockTokenContract.balanceOf(amaraa.address)).to.equal(tokenAmount);

    // Testing Exchange Deposit Functions
    let exchangeTokenAmount = ethers.utils.parseUnits('500',18)
    await mockTokenContract.connect(amaraa).approve(exchangeContract.address,exchangeTokenAmount)
    await exchangeContract.connect(amaraa).deposit(exchangeTokenAmount)

    let oldTokenAmount = ethers.utils.parseUnits('500',18)
    expect(await newTokenContract.balanceOf(amaraa.address)).to.equal(exchangeTokenAmount);
    expect(await mockTokenContract.balanceOf(amaraa.address)).to.equal(oldTokenAmount);
  });

  it("Exchange - Withdraw Test", async function () {
    // Sending 1000 Mock Tokens to Amaraa User
    let tokenAmount = ethers.utils.parseUnits('1000',18)
    await mockTokenContract.transfer(amaraa.address,tokenAmount)

    expect(await mockTokenContract.balanceOf(amaraa.address)).to.equal(tokenAmount);

    // Testing Exchange Deposit Functions
    let exchangeTokenAmount = ethers.utils.parseUnits('500',18)
    await mockTokenContract.connect(amaraa).approve(exchangeContract.address,exchangeTokenAmount)
    await exchangeContract.connect(amaraa).deposit(exchangeTokenAmount)

    let oldTokenAmount = ethers.utils.parseUnits('500',18)
    expect(await newTokenContract.balanceOf(amaraa.address)).to.equal(exchangeTokenAmount);
    expect(await mockTokenContract.balanceOf(amaraa.address)).to.equal(oldTokenAmount);

    // Testing Exchange Withdraw Functions
    await newTokenContract.connect(amaraa).approve(exchangeContract.address,exchangeTokenAmount)
    await exchangeContract.connect(amaraa).withdraw(exchangeTokenAmount)

    expect(await newTokenContract.balanceOf(amaraa.address)).to.equal("0");
    expect(await mockTokenContract.balanceOf(amaraa.address)).to.equal(tokenAmount);
  });

  it("Exchange - Pause", async function () {
    await exchangeContract.connect(odko).pause()

    expect(await exchangeContract.paused()).to.equal(true);

    let amount = ethers.utils.parseUnits('10',18)

    await mockTokenContract.connect(amaraa).approve(exchangeContract.address,amount)
    await newTokenContract.connect(amaraa).approve(exchangeContract.address,amount)

    await expect(exchangeContract.connect(amaraa).deposit(amount))
      .to.be.revertedWith('Pausable: paused');

    await expect(exchangeContract.connect(amaraa).withdraw(amount))
      .to.be.revertedWith('Pausable: paused');
  });

  it("Owner shouldn't be able to mint", async function () {
    let amount = ethers.utils.parseUnits('10',18)

    await expect(newTokenContract.connect(odko).mint(odko.address,amount))
      .to.be.reverted;
  });

});

