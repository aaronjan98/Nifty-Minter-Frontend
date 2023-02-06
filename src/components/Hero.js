import { ethers } from 'ethers'
import { Container, Row, Button } from 'react-bootstrap'

import YoutubeEmbed from './YoutubeEmbed.js'

const { ethereum } = window

const Hero = ({ setAccount }) => {
  const connectHandler = async () => {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    })
    setAccount(ethers.utils.getAddress(accounts[0]))
  }

  return (
    <Container className="container">
      <h1>Generative NFTs with AI</h1>
      <Row style={{ marginBottom: '15px' }}>
        <YoutubeEmbed embedId="bSk57Y9tEbs" />
      </Row>

      <Row>
        <Button onClick={connectHandler}>Connect Wallet to Get Started</Button>
      </Row>
    </Container>
  )
}

export default Hero
