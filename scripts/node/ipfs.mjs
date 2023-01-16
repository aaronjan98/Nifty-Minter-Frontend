import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import { spawn } from "child_process";

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

  genImg(inputPrompt) {
    // TODO: check prompt string is valid
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(
        "/Users/jan/.local/share/virtualenvs/python-e6ytlNl5/bin/python3",
        ["../python/gen_img.py", "generate_image", inputPrompt, this.apiKey],
        { stdio: "pipe" }
      );
      let chunks = [];

      pythonProcess.stdout.on("data", (data) => {
        chunks.push(data);
      });

      pythonProcess.stderr.on("data", (error) => {
        reject(error);
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          reject(`child process exited with code ${code}`);
        } else {
          const imageBytes = Buffer.concat(chunks);
          const uint8Array = new Uint8Array(imageBytes);

          this.uploadImg2IPFS(uint8Array)
            .then((uri) => resolve(uri))
            .catch((err) => reject(err));
        }
      });
    });
  }

  async uploadImg2IPFS(fileContent) {
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

    const result = await client.add(fileContent);
    const uri = `${subdomain}/ipfs/${result.path}`;

    return uri;
  }
}

export default genImgAndRtnUri;
