import { Buffer } from "buffer";
// const { create } = require("ipfs-http-client");
import { create } from "ipfs-http-client";

const projectSecret = process.env.INFURA_API_KEY || "";
const projectId = process.env.INFURA_PROJECT_ID || "";
const subdomain = "https://ai-gen-nft-minter.infura-ipfs.io";

async function addFile(file) {
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

  const image = `${subdomain}/ipfs/${result.path}`;
  console.log({ image });

  const uri = `${subdomain}/ipfs/${result.path}`;
  console.log({ uri });

  return uri;
}

addFile(file);
