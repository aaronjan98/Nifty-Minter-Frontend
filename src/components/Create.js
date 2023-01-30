import React, { useState } from 'react'
import { FormControl } from 'react-bootstrap'
import axios from 'axios'

import { Buffer } from 'buffer'
import { create } from 'ipfs-http-client'

const projectSecret = process.env.REACT_APP_INFURA_API_KEY || ''
const projectId = process.env.REACT_APP_INFURA_PROJECT_ID || ''
const subdomain = 'https://ai-gen-nft-minter.infura-ipfs.io'

const huggingFaceKey = process.env.REACT_APP_HUGGING_FACE_KEY || ''

const Create = () => {
  const [textPrompt, setTextPrompt] = useState('')
  const [image, setImage] = useState(null)
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

    console.log({ url })
    // await mintImage(url)

    setIsWaiting(false)
    setMessage('')
  }

  const createImage = async () => {
    let data, type

    setMessage('Generating Image...')

    try {
      const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`

      // Send the request
      const response = await axios({
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

    const uint8Array = new Uint8Array(data)

    return uint8Array
  }

  const uploadImage = async fileContent => {
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

    const result = await client.add(fileContent)
    const uri = `${subdomain}/ipfs/${result.path}`

    setURL(uri)

    return uri
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl
          type="text"
          placeholder="Enter a description for the image"
          value={textPrompt}
          onChange={e => setTextPrompt(e.target.value)}
        />
        <button type="submit">Generate Image</button>
      </form>
      {/* {response && <p>{response}</p>} */}
      {url && <img src={url} alt="Generated Image" />}
    </div>
  )
}

export default Create
