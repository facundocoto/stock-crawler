const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const notifier = require("node-notifier");

const { URLS } = require("./constants");

async function fravega_series_x() {
  const { data: htmlAsString } = await axios.get(URLS.FRAVEGA_XBOX_SERIES_X);
  const parsedHtml = cheerio.load(htmlAsString);
  const fravegaStockLabel = parsedHtml(
    "#__next > div.withMainLayout__LayoutWrapper-sc-1lj5zpr-1.hhFziS > div > div > div.ProductDetails__NotAvailableWrapper-sc-2486oi-0.cxXFXL > section > p"
  );
  return fravegaStockLabel.text() !== "Producto temporalmente sin stock";
}

async function fravega_series_s() {
  const { data: htmlAsString } = await axios.get(URLS.FRAVEGA_XBOX_SERIES_S);
  

  const parsedHtml = cheerio.load(htmlAsString);
  const fravegaStockLabel = parsedHtml(
    "#__next > div.withMainLayout__LayoutWrapper-sc-1lj5zpr-1.hhFziS > div > div > div.generalstyles__Row-sc-1j7wv79-0.generalstyles__RowNoSpaceTopBottom-sc-1j7wv79-1.ekzajL > div > div.PurchaseInfo__PurchaseInfoWrapper-sc-1wok6te-5.cRiVbx > div.PurchaseInfo__PriceWrapper-sc-1wok6te-4.hUnqwx"
  );
  return fravegaStockLabel.text() !== '';
}

async function atajo_series_s() {
  const { data: htmlAsString } = await axios.get(URLS.ATAJO_XBOX_SERIES_S);

  const parsedHtml = cheerio.load(htmlAsString);
  const atajoStockLabel = parsedHtml(
    "#detalle > div.col-lg-6.col-md-6.col-sm-6.detalle_producto > h3.leyendaSinStock"
  );

  return atajoStockLabel.text() !== "Sin Stock";
}

async function atajo_series_x() {
  const { data: htmlAsString } = await axios.get(URLS.ATAJO_XBOX_SERIES_X_KIT);

  const parsedHtml = cheerio.load(htmlAsString);
  const atajoStockLabel = parsedHtml(
    "#detalle > div.col-lg-6.col-md-6.col-sm-6.detalle_producto > h3.leyendaSinStock"
  );

  return atajoStockLabel.text() !== "Sin Stock";
}

async function garbarino() {
  const { data: htmlAsString } = await axios.get(URLS.GARBARINO_SERIES_S);

  const parsedHtml = cheerio.load(htmlAsString);
  const garbarinoStockLabel = parsedHtml(
    "body > div.gb-wrapper > div.gb-products-carousel > div > div.gb-vintage-carousel-head > div.gb-vintage-carousel-head-image > span"
  );

  return garbarinoStockLabel.text() !== "AGOTADO";
}

async function main() {
  console.log("Buscando stock cada 5 minutos...");
  cron.schedule("*/5 * * * *  ", async () => {
  const atajoStockSeriesS = await atajo_series_s();
  const atajoStockSeriesX = await atajo_series_x();
  const fravegaStockX = await fravega_series_x();
  const fravegaStockS = await fravega_series_s();
  const garbarinoStock = await garbarino();

  console.log({
    Fravega: { SeriesX: fravegaStockX, SeriesS: fravegaStockS },
    Atajo: { SeriesX: atajoStockSeriesX, SeriesS: atajoStockSeriesS },
    Garbarino: { SeriesS: garbarinoStock },
  });

  if (
    fravegaStockX ||
    fravegaStockS ||
    atajoStockSeriesS ||
    atajoStockSeriesS ||
    garbarinoStock
  ) {
    notifier.notify("Hay stock!");
  }
  });
}

main();
