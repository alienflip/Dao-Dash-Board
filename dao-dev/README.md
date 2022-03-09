
<h1 align="center">
  Ethereum Tooling
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/npm-v8.1.2-red"></img>
  <img src="https://img.shields.io/badge/node-v16.13.1-green"></img>
  <img src="https://img.shields.io/badge/solidity-v0.8.1-orange"></img>
</p>

<p align="center">🍄 In this framework, we deploy and interact with a contract on testnet which is desined to handle adding and removing members from a DAO through a simple voting protocol 🍄</p>

> Protocol 
> > A DAO member can initate a vote if and only if there is no current round active. A DAO member can add a vote or end a round if and only if there is a round active

> Layer 2 networks
> > To use `harmony`, you must add tokens [to](https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet/adding-harmony) metamask, and then fund your wallet with a faucet
------------
------------

## Installation

```
npm i
```

------------

## ENV

Add your dummy accounts and network endpoints to this file. A template exists there already.

Find your harmony addresses [with this](https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet/sending-and-receiving)

`DON'T ADD MAINNET DATA HERE!`

------------

## Faucets

#### rinkeby 
> https://rinkebyfaucet.com/

#### Harmony

> https://faucet.pops.one/

## Compile DAO contracts

```
npx hardhat compile
```

------------

## Deploy DAO contracts 

> networks integrated : `rinkeby`
> > networks in dev : `harmony`

```
npx hardhat run scripts/deploy.js --network <network>
```

------------

## Interact with DAO contracts

> here you should specify `<network>` = `<ropsten>`, `<harmony>`, `<metis>`  and `<account>` = `<0>`, `<1>`, `<2>`
 
>> Fund contract
```
node interact/fund.js <network> <account number>
```

>> Print to console voting events as they occur
```
node interact/watchEvents.js <network> <account number>
```

>> User queries current voting round variables
```
node interact/getVoteDetails.js <network> <account number>
```

>> DAO member can initate a vote
```
node interact/newVote.js <network> <account number>
```
>> DAO member can add a vote to the current round
```
node interact/addVote.js <network> <account number>
```

>> DAO member can close the current round
```
node interact/completeVote.js <network> <account number>
```

------------

## Known Errors

> Usually down to underpriced transactions -> increase gas

------------
------------
