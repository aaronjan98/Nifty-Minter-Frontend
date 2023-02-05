import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'

import Loading from './Loading'

const DisplayNFTs = ({ nft, wallet, account, balance }) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [walletArray, setWalletArray] = useState([])

  useEffect(() => {
    if (wallet) {
      const fetchData = async () => {
        const promises = wallet.map(async (value, index) => {
          const tokenURI = await nft.tokenURI(value.toString())
          const data = tokenURI.split(',')[1]
          const decodedData = atob(data)
          const metadata = JSON.parse(decodedData)
          console.log('metadata: ', metadata)

          return (
            <Carousel.Item key={index} interval={1600}>
              <img
                className="d-block w-100 image"
                src={metadata.image}
                alt="AI generated Image"
              />
            </Carousel.Item>
          )
        })

        const walletArray = await Promise.all(promises)
        setWalletArray(walletArray)
      }

      fetchData().catch(error => console.error(error))
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
