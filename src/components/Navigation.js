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
            <svg height="40" width="50" viewBox="130 0 75 75" alt="logo">
              <g
                id="SvgjsG1951"
                featurekey="rZF8Vg-0"
                transform="matrix(0.8676939698164235,0,0,0.8676939698164235,126.45377135826094,-1.5462286417390598)"
                fill="#272f51"
              >
                <g xmlns="http://www.w3.org/2000/svg">
                  <circle fill="#272f51" cx="45" cy="44.999" r="5.277"></circle>
                  <g>
                    <g>
                      <path
                        fill="#272f51"
                        d="M45.214,33.672c24.117-31.271,0.369-31.89,0.369-31.89S21.827,1.851,45.214,33.672z"
                      ></path>
                    </g>
                    <g>
                      <path
                        fill="#272f51"
                        d="M37.141,36.837c-5.059-39.164-22.288-22.81-22.288-22.81S-1.896,30.874,37.141,36.837z"
                      ></path>
                    </g>
                    <g>
                      <path
                        fill="#272f51"
                        d="M33.67,44.786c-31.269-24.119-31.888-0.37-31.888-0.37S1.851,68.173,33.67,44.786z"
                      ></path>
                    </g>
                    <g>
                      <path
                        fill="#272f51"
                        d="M36.837,52.859c-39.166,5.059-22.81,22.288-22.81,22.288S30.874,91.899,36.837,52.859z"
                      ></path>
                    </g>
                    <g>
                      <path
                        fill="#272f51"
                        d="M44.785,56.33c-24.118,31.271-0.369,31.888-0.369,31.888S68.171,88.149,44.785,56.33z"
                      ></path>
                    </g>
                    <g>
                      <path
                        fill="#272f51"
                        d="M52.859,53.164c5.057,39.164,22.287,22.81,22.287,22.81S91.896,59.127,52.859,53.164z"
                      ></path>
                    </g>
                    <g>
                      <path
                        fill="#272f51"
                        d="M56.33,45.216c31.271,24.117,31.888,0.369,31.888,0.369S88.148,21.829,56.33,45.216z"
                      ></path>
                    </g>
                    <g>
                      <path
                        fill="#272f51"
                        d="M53.162,37.142c39.166-5.061,22.811-22.289,22.811-22.289S59.126-1.896,53.162,37.142z"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
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
    </Navbar>
  )
}

export default Navigation
