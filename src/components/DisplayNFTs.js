import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'

import Loading from './Loading'

const DisplayNFTs = ({ nft, wallet, account, balance }) => {
  const [isWaiting, setIsWaiting] = useState(false)

  const wall = async () => {
    // console.log('Display wallet: ', (await nft.balanceOf(account)).toString())
    console.log('number of nfts: ', balance.toString())
    // console.log('wallet: ', await nft.walletOfOwner(account))
    console.log('wallet: ', wallet)
  }

  wall()

  return (
    <>
      {isWaiting ? (
        <Loading />
      ) : (
        <>
          <Row>
            {balance > 0 ? (
              <Carousel className="text-center">
                {wallet.map((value, index) =>
                  console.log(index, value.toString())
                )}
              </Carousel>
            ) : (
              <p className="image">Please connect wallet.</p>
            )}
          </Row>
        </>
      )}
    </>
  )
}

export default DisplayNFTs
