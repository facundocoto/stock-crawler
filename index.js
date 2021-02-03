const axios = require("axios");
const HTMLParser = require("node-html-parser");

const { URLS } = require("./constants");

async function main() {
  console.log("Buscando stock");
  const { data: htmlAsString } = await axios.get(URLS.FRAVEGA_XBOX_SERIES_X);

  const parsedHtml = HTMLParser.parse(htmlAsString);
  const fravegaStock = parsedHtml.querySelector(
    "#__next > div:nth-child(4) > div > div > div:nth-child(2) > section"
  );
  if (!fravegaStock) console.log("No hay stock pa");
}

main();
