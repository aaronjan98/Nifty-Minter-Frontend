import React, { useState } from 'react'
import { FormControl } from 'react-bootstrap'
import axios from 'axios'
// import GenImgAndRtnUri from '/Users/jan/code/capstone/frontend/scripts/node/ipfs.mjs'
// import GenImgAndRtnUri from 'ipfs.mjs'

const Create = () => {
  const [textPrompt, setTextPrompt] = useState('')
  const [imgURI, setImgURI] = useState('')

  const [response, setResponse] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    // const uri = await new GenImgAndRtnUri().genImg(textPrompt)
    // setImgURI(uri)

    try {
      const res = await axios.post(
        'https://z7ohzqll2wakpar5zohmwtjkh40uubxd.lambda-url.us-west-1.on.aws/',
        textPrompt,
        {
          headers: {
            sk: 'sk-v1SKaIGWChwbBcju25Y7CYNZd0vh4KxcSyp3CZGBQBMr79HF',
          },
          timeout: 10000,
        }
      )

      console.log(await res.json())
      setResponse(res.config.data)
    } catch (err) {
      console.error(err)
    }
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
      {response && <p>{response}</p>}
      {/* {imgURI && <img src={imgURI} alt="Generated Image" />} */}
    </div>
  )
}

export default Create
