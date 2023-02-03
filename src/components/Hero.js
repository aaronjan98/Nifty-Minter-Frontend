import { useState } from 'react'
import { ethers } from 'ethers'
import { Container, Row, Col, Button } from 'react-bootstrap'

import YoutubeEmbed from './YoutubeEmbed.js'

const { ethereum } = window

const getRandomImage = () => {
  const NUM_IMAGES = 20
  const randomIndex = Math.floor(Math.random() * NUM_IMAGES)
  return require(`../../images/${randomIndex}.png`)
}

const Hero = ({ setAccount }) => {
  const [image, setImage] = useState(getRandomImage())

  const randImgHandler = () => {
    setImage(getRandomImage())
  }

  const connectHandler = async () => {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    })
    setAccount(ethers.utils.getAddress(accounts[0]))
  }

  return (
    <Container className="container">
      <h1>Generative NFTs with AI</h1>
      <Row style={{ margin: '10px 0 25px 0' }}>
        <YoutubeEmbed embedId="bSk57Y9tEbs" />
      </Row>

      <Row>
        <Button onClick={connectHandler}>Connect Wallet to Get Started</Button>
      </Row>
    </Container>
  )
}

export default Hero
