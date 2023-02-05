import { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'

const DisplayNFTs = ({ nft, account, wallet, balance }) => {
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
                alt="AI generated NFT"
              />
            </Carousel.Item>
          )
        })

        const walletArray = await Promise.all(promises)
        setWalletArray(walletArray)
      }

      fetchData().catch(error => console.error(error))
    }
  }, [account, wallet])

  return (
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
  )
}

export default DisplayNFTs
