import { ethers } from 'ethers'
import { Nav } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Blockies from 'react-blockies'

import logo from '../logo.svg'

import config from '../config.json'
const { ethereum } = window

const Navigation = ({ account, setAccount, chainId }) => {
  const connectHandler = async () => {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    })
    setAccount(ethers.utils.getAddress(accounts[0]))
  }

  const networkHandler = async e => {
    try {
      // Switch to the selected network
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: e.target.value }],
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: e.target.value,
                rpcUrls: ['http://127.0.0.1:9002'],
              },
            ],
          })
        } catch (error) {
          console.error("AJ's Error: failed to add chain to MetaMask", error)
        }
      } else {
        console.log(
          `AJ - ${switchError.code}: failed to switch networks `,
          switchError
        )
      }
    }
  }

  return (
    <Navbar className="my-3">
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#">Text2Image NFT Minter</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Nav className="mr-auto">
          <Nav.Link href="#generate">Generate Text-to-Image Art</Nav.Link>
          <Nav.Link href="#mint">Mint NFT</Nav.Link>
          <Nav.Link href="#view">View My NFTs</Nav.Link>
        </Nav>

        <div className="d-flex justify-content-end mt-3">
          <Form.Select
            aria-label="Network Selector"
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            onChange={networkHandler}
            style={{ maxWidth: '200px', marginRight: '20px' }}
          >
            <option value="0" disabled>
              Select Network
            </option>
            <option value={`0x${(1338).toString(16)}`}>Localhost</option>
            <option value="0x5">Goerli</option>
          </Form.Select>

          {account ? (
            <Navbar.Text className="d-flex align-items-center">
              {account.slice(0, 5) + '...' + account.slice(38, 42)}
              <Blockies
                seed={account}
                size={10}
                scale={3}
                color="#2187D0"
                bgColor="#F1F2F9"
                spotColor="#767F92"
                className="identicon mx-2"
              />
            </Navbar.Text>
          ) : (
            <Button onClick={connectHandler}>Connect</Button>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
