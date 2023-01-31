import { useState } from 'react'
import { FormControl, Button } from 'react-bootstrap'
import { ethers } from 'ethers'
import axios from 'axios'

import { Buffer } from 'buffer'
import { create } from 'ipfs-http-client'

import Spinner from 'react-bootstrap/Spinner'

const projectSecret = process.env.REACT_APP_INFURA_API_KEY || ''
const projectId = process.env.REACT_APP_INFURA_PROJECT_ID || ''
const huggingFaceKey = process.env.REACT_APP_HUGGING_FACE_KEY || ''

const subdomain = 'https://ai-gen-nft-minter.infura-ipfs.io'

const Create = ({ nft, provider }) => {
  const [textPrompt, setTextPrompt] = useState('')
  const [url, setURL] = useState(null)

  const [response, setResponse] = useState(null)

  const [message, setMessage] = useState('')
  const [isWaiting, setIsWaiting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    if (textPrompt === '') {
      window.alert('Please provide a name and description')
      return
    }

    setIsWaiting(true)

    const imageData = await createImage()
    const url = await uploadImage(imageData)

    // display image before minting
    setIsWaiting(false)
    await mintImage(url)

    setMessage('')
  }

  const createImage = async () => {
    let response, data, type

    setMessage('Generating Image...')

    try {
      const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`

      // Send the request
      response = await axios({
        url: URL,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${huggingFaceKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          inputs: textPrompt,
          options: { wait_for_model: true },
        }),
        responseType: 'arraybuffer',
      })

      type = response.headers['content-type']
      data = response.data

      setResponse(data)
    } catch (err) {
      console.error(err)
    }

    return data
  }

  const uploadImage = async fileContent => {
    setMessage('Uploading Image to IPFS...')
    const uint8Array = new Uint8Array(fileContent)

    // encrypt the authorization
    const authorization = `Basic ${Buffer.from(
      `${projectId}:${projectSecret}`
    ).toString('base64')}`

    const client = await create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization,
      },
    })

    const result = await client.add(uint8Array)
    const uri = `${subdomain}/ipfs/${result.path}`
    setURL(uri)

    return uri
  }

  const mintImage = async tokenURI => {
    setMessage('Waiting for Mint...')

    const signer = await provider.getSigner()
    const transaction = await nft
      .connect(signer)
      .mint(tokenURI, { value: ethers.utils.parseEther('0.1') })
    await transaction.wait()
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="prompt">
        <FormControl
          type="text"
          placeholder="Enter a description for the image"
          value={textPrompt}
          onChange={e => setTextPrompt(e.target.value)}
        />
        <Button type="submit">Create and Mint NFT</Button>
      </form>

      <div className="image">
        {!isWaiting && url ? (
          <img src={url} alt="AI generated Image" />
        ) : isWaiting ? (
          <div
            className="image__placeholder"
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Spinner animation="grow" />
            <p>{message}</p>
          </div>
        ) : (
          <>Generated Images will appear here</>
        )}
      </div>
    </div>
  )
}

export default Create
