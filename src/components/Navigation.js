import { useState } from 'react'
import { ethers } from 'ethers'
import {
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap'
import Blockies from 'react-blockies'

import '../styles/hamburger.scss'
import { ReactComponent as Logo } from '../logo.svg'

import config from '../config.json'
const { ethereum } = window

const Navigation = ({ account, setAccount, chainId }) => {
  const [isActive, setIsActive] = useState(false)

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
    <Navbar className="mb-3 mt-4">
      <div
        className="d-flex justify-content-start"
        style={{ alignItems: 'center' }}
      >
        <Navbar.Toggle
          onClick={() => setIsActive(!isActive)}
          className={`ham ${isActive ? 'active' : ''} custom-toggle`}
        >
          <div className="menu-icon">
            <input className="menu-icon__cheeckbox" type="checkbox" />
            <div>
              <span></span>
              <span></span>
            </div>
          </div>
          <NavDropdown show={isActive}>
            <NavDropdown.Item href="#generate">
              Generate Text-to-Image Art
            </NavDropdown.Item>
            <NavDropdown.Item href="#mint">Mint NFT</NavDropdown.Item>
            <NavDropdown.Item href="#view">View My NFTs</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Toggle>

        <div className="d-flex justify-content-center">
          <a href="#">
            <Logo alt="logo" className="d-inline-block align-top mx-3" />
          </a>
          <Navbar.Brand href="#">Nifty Minter</Navbar.Brand>
        </div>
      </div>

      <div
        className="d-flex justify-content-end"
        style={{ alignItems: 'center' }}
      >
        <Form.Select
          aria-label="Network Selector"
          value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
          onChange={networkHandler}
          style={{
            maxWidth: '200px',
            marginRight: '20px',
            height: '100%',
          }}
        >
          <option value="0" disabled>
            Select Network
          </option>
          <option value={`0x${(1338).toString(16)}`}>Localhost 9002</option>
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
    </Navbar>
  )
}

export default Navigation
