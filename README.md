![](cover.png)

**A set of challenges to hack implementations of DeFi in Ethereum.**
Featuring flash loans, price oracles, governance, NFTs, lending pools, smart contract wallets, timelocks, and more!

Created by [@tinchoabbate](https://twitter.com/tinchoabbate)

## Levels

### **1 - Unstoppable [ X ]**

    There’s a tokenized vault with a million DVT tokens deposited. It’s offering flash loans for free, until the grace period ends.
    To pass the challenge, make the vault stop offering flash loans.
    You start with 10 DVT tokens in balance.

[Article with detailed solution]()

### **2 - Naive receiver [ X ]**

    There’s a pool with 1000 ETH in balance, offering flash loans. It has a fixed fee of 1 ETH.
    A user has deployed a contract with 10 ETH in balance. It’s capable of interacting with the pool and receiving flash loans of ETH.
    Take all ETH out of the user’s contract. If possible, in a single transaction.

[Article with detailed solution]()

### **3 - Truster [ X ]**

    More and more lending pools are offering flash loans. In this case, a new pool has launched that is offering flash loans of DVT tokens for free.
    The pool holds 1 million DVT tokens. You have nothing.
    To pass this challenge, take all tokens out of the pool. If possible, in a single transaction.

[Article with detailed solution]()

### **4 - Side entrance [ X ]**

    A surprisingly simple pool allows anyone to deposit ETH, and withdraw it at any point in time.
    It has 1000 ETH in balance already, and is offering free flash loans using the deposited ETH to promote their system.
    Starting with 1 ETH in balance, pass the challenge by taking all ETH from the pool.

[Article with detailed solution]()

### **5 - The rewarder [ X ]**

    There’s a pool offering rewards in tokens every 5 days for those who deposit their DVT tokens into it.
    Alice, Bob, Charlie and David have already deposited some DVT tokens, and have won their rewards!
    You don’t have any DVT tokens. But in the upcoming round, you must claim most rewards for yourself.
    By the way, rumours say a new pool has just launched. Isn’t it offering flash loans of DVT tokens?

[Article with detailed solution]()

### **6 - Selfie [ X ]**

    A new cool lending pool has launched! It’s now offering flash loans of DVT tokens. It even includes a fancy governance mechanism to control it.
    What could go wrong, right?
    You start with no DVT tokens in balance, and the pool has 1.5 million. Your goal is to take them all.

[Article with detailed solution]()

### **7 - Compromised [ X ]**

[Article with detailed solution]()

### **8 - Puppet [ X ]**

    There’s a lending pool where users can borrow Damn Valuable Tokens (DVTs). To do so, they first need to deposit twice the borrow amount in ETH as collateral. The pool currently has 100000 DVTs in liquidity.
    There’s a DVT market opened in an old Uniswap v1 exchange, currently with 10 ETH and 10 DVT in liquidity.
    Pass the challenge by taking all tokens from the lending pool. You start with 25 ETH and 1000 DVTs in balance.

[Article with detailed solution]()

### **9 - Puppet v2 [ X ]**

[Article with detailed solution]()

### **10 - Free rider [ X ]**

[Article with detailed solution]()

### **11 - Backdoor [ X ]**

[Article with detailed solution]()

### **12 - Climber [ X ]**

[Article with detailed solution]()

### **13 - Safe Miners [ X ]**

## Play

Visit [damnvulnerabledefi.xyz](https://damnvulnerabledefi.xyz)

## Disclaimer

All Solidity code, practices and patterns in this repository are DAMN VULNERABLE and for educational purposes only.

DO NOT USE IN PRODUCTION.
