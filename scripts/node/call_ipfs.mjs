import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import pythonBridge from "python-bridge";

import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const projectSecret = process.env.INFURA_API_KEY || "";
const projectId = process.env.INFURA_PROJECT_ID || "";
const stabilityKey = process.env.STABILITY_KEY || "";
const subdomain = "https://ai-gen-nft-minter.infura-ipfs.io";

class genImgAndRtnUri {
  constructor() {
    // TODO: add conditions to check the key is valid
    this.apiKey = stabilityKey;
  }

  /**
   * @return {string} stabilityKey
   */
  getApiKey() {
    return this.apiKey;
  }

  async uploadImg2IPFS(file) {
    // encrypt the authorization
    const authorization = `Basic ${Buffer.from(
      `${projectId}:${projectSecret}`
    ).toString("base64")}`;

    const client = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization,
      },
    });

    const data = {
      content: file,
    };
    const result = await client.add(data);
    const uri = `${subdomain}/ipfs/${result.path}`;
    console.log({ uri });

    return uri;
  }

  genImg(inputPrompt) {
    // TODO: check prompt string is valid
    return new Promise((resolve, reject) => {
      const python = pythonBridge();
      python.ex`
import io
import warnings
import numpy as np
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from datetime import datetime

def gen_img_and_rtn_uint8arr(input_prompt: str, stabilityKey: str):
    try:
        stability_api = client.StabilityInference(
            key=stabilityKey,
            verbose=True,
        )
    except KeyError:
        warnings.warn("STABILITY_KEY not found in environment")

    # the object returned is a python generator
    answers = stability_api.generate(
        prompt=input_prompt,
        seed=34567,  # if provided, specifying a random seed makes results deterministic
        steps=20,  # defaults to 30 if not specified
    )

    # iterating over the generator produces the api response
    for resp in answers:
        for artifact in resp.artifacts:
            print('artifact: ', artifact)
            if artifact.finish_reason == generation.FILTER:
                warnings.warn(
                    "Your request activated the API's safety filters and could not be processed."
                    "Please modify the prompt and try again."
                )
            if artifact.type == generation.ARTIFACT_IMAGE:
                print('artifact binary: ', artifact.binary)
                binary_data = io.BytesIO(artifact.binary)
                image_data = np.frombuffer(binary_data.read(), np.uint8)
                uint8array_data = np.asarray(image_data, dtype=np.uint8)
                return uint8array_data
`;
      python`gen_img_and_rtn_uint8arr(${inputPrompt}, ${this.apiKey})`
        .then((data) => {
          if (data === "ERROR")
            reject("An error has occurred, please try again later");
          else {
            resolve(data);
            console.log({ data });
            // TODO: return IPFS image URI
            // const uri = this.uploadImg2IPFS(data);
          }
        })
        .catch(python.Exception, (err) => reject(err));

      python.end();
    });
  }
}

export default genImgAndRtnUri;
