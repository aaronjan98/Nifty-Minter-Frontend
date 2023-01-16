import GenImgAndRtnUri from "./ipfs.mjs";

const textPrompt =
  "A digital animation exploring the theme of artificial intelligence and its impact on humanity";
const imgURI = new GenImgAndRtnUri();

imgURI
  .genImg(textPrompt)
  .then((uri) => console.log({ uri }))
  .catch((err) => console.error({ err }));
