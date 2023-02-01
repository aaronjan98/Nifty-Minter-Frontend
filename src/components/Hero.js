import { ethers } from 'ethers'
import { Container, Row, Col, Button } from 'react-bootstrap'
const { ethereum } = window

const NUM_IMAGES = 20
const randomIndex = Math.floor(Math.random() * NUM_IMAGES)
const Image = require(`../../images/${randomIndex}.png`)

const Hero = ({ setAccount }) => {
  const connectHandler = async () => {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    })
    setAccount(ethers.utils.getAddress(accounts[0]))
  }

  return (
    <Container className="container">
      <h1>Text-to-image NFT Generation</h1>
      <Row className="hero-row">
        <Col style={{ display: 'flex', alignItems: 'center' }}>
          <p>
            Create and mint an AI generated image like the one on the right in
            one step. Click on image to see more.
          </p>
        </Col>
        <Col>
          <img
            className="image__placeholder hero-image"
            src={Image}
            alt="Random Image"
          />
        </Col>
      </Row>

      <Row>
        <Button onClick={connectHandler}>Connect to Metamask</Button>
      </Row>
    </Container>
  )
}

export default Hero
