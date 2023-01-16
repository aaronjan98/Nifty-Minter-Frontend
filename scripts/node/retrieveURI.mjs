import GenImgAndRtnUri from "./ipfs.mjs";

const textPrompt =
  "A majestic castle on a hilltop surrounded by lush green forests";
const imgURI = new GenImgAndRtnUri();

imgURI
  .genImg(textPrompt)
  .then((uri) => console.log({ uri }))
  .catch((err) => console.error({ err }));
