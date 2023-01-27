import GenImgAndRtnUri from "./ipfs.mjs";

const textPrompt = "A futuristic city skyline at night with flying cars";
const imgURI = new GenImgAndRtnUri();

imgURI
  .genImg(textPrompt)
  .then((uri) => console.log({ uri }))
  .catch((err) => console.error({ err }));
