import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'

import Loading from './Loading'

const DisplayNFTs = ({ nft, wallet, account, balance }) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [walletArray, setWalletArray] = useState([])

  useEffect(() => {
    if (wallet) {
      Promise.all(
        wallet.map(async (value, index) => {
          let image = await nft.tokenURI(value.toString())

          return (
            <Carousel.Item key={index} interval={1600}>
              <img
                className="d-block w-100 image"
                src={image}
                alt="AI generated Image"
              />
            </Carousel.Item>
          )
        })
      )
        .then(walletArray => setWalletArray(walletArray))
        .catch(error => console.error(error))
    }
  }, [wallet, account])

  return (
    <>
      {isWaiting ? (
        <Loading />
      ) : (
        <>
          {walletArray.length > 0 && (
            <div className="container">
              <h2 id="view">View your NFTs</h2>
              <Row>
                <Col>
                  <Carousel className="text-center">{walletArray}</Carousel>
                </Col>
              </Row>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DisplayNFTs
