import { useEffect, useState } from 'react'
// import { Route, Link, Switch } from "react-router-dom";
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

import Navigation from './Navigation'
import Loading from './Loading'

import NFT_ABI from '../abis/NFT.json'
import config from '../config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [nft, setNFT] = useState(null)

  const [chainId, setChainId] = useState(null)
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [wallet, setWallet] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const { chainId } = await provider.getNetwork()
    setChainId(chainId)

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // Fetch current account from Metamask when changed
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })

    // Initiate contract
    const nft = new ethers.Contract(
      config[chainId].nft.address,
      NFT_ABI,
      provider
    )
    setNFT(nft)

    // Fetch all NFTs from account wallet
    setWallet(await nft.walletOfOwner(account))

    // Fetch account balance
    let balance = await provider.getBalance(account)
    balance = ethers.utils.formatUnits(balance, 18)
    setBalance(balance)

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading])

  return (
    <Container>
      <Navigation account={account} chainId={chainId} />

      <hr />

      <h1 className="my-4 text-center">React Hardhat Template</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className="text-center">
            <strong>Your ETH Balance:</strong> {balance} ETH
          </p>
          <p className="text-center">Edit App.js to add your code here.</p>
        </>
      )}
    </Container>
  )
}

export default App
