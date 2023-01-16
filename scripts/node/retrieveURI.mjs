import GenImgAndRtnUri from "./ipfs.mjs";

const textPrompt =
  "A performance art piece that addresses the theme of mental health and self-care";
const imgURI = new GenImgAndRtnUri();

imgURI
  .genImg(textPrompt)
  .then((uri) => console.log({ uri }))
  .catch((err) => console.error({ err }));
