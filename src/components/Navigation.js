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

import '../styles/hamburger.css'
import logo from '../logo.svg'

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
      <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Toggle
          id="basic-navbar-nav"
          aria-controls="basic-navbar-nav"
          aria-label="Toggle navigation"
          className={`ham ${isActive ? 'active' : ''} custom-toggle my-navbar`}
          onClick={() => setIsActive(!isActive)}
        >
          <svg
            class="ham hamRotate ham8"
            viewBox="0 0 100 100"
            width="80"
            onclick="this.classList.toggle('active')"
          >
            <path
              class="line top"
              d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
            />
            <path class="line middle" d="m 30,50 h 40" />
            <path
              class="line bottom"
              d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
            />
          </svg>
        </Navbar.Toggle>
        <Nav className="mr-auto">
          <NavDropdown.Item href="#generate">
            Generate Text-to-Image Art
          </NavDropdown.Item>
          <NavDropdown.Item href="#mint">Mint NFT</NavDropdown.Item>
          <NavDropdown.Item href="#view">View My NFTs</NavDropdown.Item>
        </Nav>
      </Navbar.Collapse>

      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#">Text2Image NFT Minter</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
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
