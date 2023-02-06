<h1 align="center">Nifty Minter Dapp - Front End</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/AJanovitch" target="_blank">
    <img alt="Twitter: AJanovitch" src="https://img.shields.io/twitter/follow/AJanovitch.svg?style=social" />
  </a>
</p>

> Create unique NFTs from text descriptions with AI image generation and sell them on [OpenSea](https://testnets.opensea.io)

## Resources

- [Deployed Site](https://nifty-minter.herokuapp.com)
- [Watch tutorial on how to use the Dapp](https://www.youtube.com/watch?v=bSk57Y9tEbs)
- [The Backend Repo](https://github.com/aaronjan98/Nifty-Minter-Backend)
- [Contract on Etherscan](https://goerli.etherscan.io/address/0x8d20aac997e30de71581ac30240db9ab235acb8b)

## Run Locally

### Install

- run this command for back and front end repos

  ```sh
  npm install
  ```

- N.B. API keys are required in your front end `.env`

  - [Get Infura API keys](https://app.infura.io)
  - [Hugging Face Key](https://huggingface.co/)

  ```.env
  REACT_APP_INFURA_API_KEY=""
  REACT_APP_INFURA_PROJECT_ID=""
  REACT_APP_HUGGING_FACE_KEY=""
  ```

### Usage

1. Run blockchain node with ganache at the root of the back end

```sh
npm run ganache
```

2. Add the network to MetaMask and import the ganache accounts

- you can change the port and chain ID in the package.json scripts,
  but by default the RPC URL is `http://127.0.0.1:9002`,
  the chain ID is `1338`, and the currency symbol is `ETH`.

3. Deploy NFT contract to local blockchain

- If the front end and back end repos are adjacent to each other,
  then the NFT ABI will automatically be written to the front end.
  Otherwise you'll have to change the file path in `common/tokens.js`.

  ```sh
  npx hardhat run scripts/deploy.js --network ganache
  ```

4. Then you'll need to copy the outputted NFT address from the previous
   command and update the NFT address in the front end file `src/config.json`

- Optionally, you can view the ganache/hardhat accounts' Ether balances
  with this command

  ```sh
  npx hardhat run scripts/getBalances.js --network ganache
  ```

5. start localhost server for front end

```sh
npm run dev
```

### Run tests

- Test contracts with hardhat

```sh
npx hardhat test
```

## Author

👤 **aaronjanovitch@gmail.com**

- Website: aaronjanovitch.com
- Twitter: [@AJanovitch](https://twitter.com/AJanovitch)
- Github: [@aaronjan98](https://github.com/aaronjan98)
- LinkedIn: [@aaron-janovitch](https://linkedin.com/in/aaron-janovitch)

## Show your support

Give a ⭐️ if this project helped you!
