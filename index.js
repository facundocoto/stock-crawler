const axios = require("axios");
const HTMLParser = require("node-html-parser");

const { URLS } = require("./constants");

async function main() {
  const { data: htmlAsString } = await axios.get(URLS.FRAVEGA_XBOX_SERIES_X);

  const fravegaTo = parsedHtml.text(
    "#__next > div:nth-child(4) > div > div > div:nth-child(2) > section"
  );
}

main();
