import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

import Navigation from './Navigation'
import Hero from './Hero'
import Create from './Create'
import DisplayNFTs from './DisplayNFTs'

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
    window.ethereum.on('chainChanged', async () => {
      window.location.reload()
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
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

    fetchAccountInfo()

    setIsLoading(false)
  }

  const fetchAccountInfo = async () => {
    if (account) {
      setWallet(await nft.walletOfOwner(account))
      setBalance(await nft.balanceOf(account))
    }
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading])

  // initial load of wallet for DisplayNFTs
  useEffect(() => {
    fetchAccountInfo()
  }, [account])

  return (
    <Container>
      <Navigation account={account} setAccount={setAccount} chainId={chainId} />

      {account ? (
        <>
          <Create
            nft={nft}
            provider={provider}
            account={account}
            fetchAccountInfo={fetchAccountInfo}
          />

          <DisplayNFTs
            nft={nft}
            account={account}
            wallet={wallet}
            balance={balance}
          />
        </>
      ) : (
        <Hero setAccount={setAccount} />
      )}
    </Container>
  )
}

export default App
