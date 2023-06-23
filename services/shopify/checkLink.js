const path = require("path");
// const combinations = require("combinations");
const { iHttp, setBaseUrl } = require("../iAxios");

const checkLink = async (link) => {
  const newUrl = new URL(link);

  try {
    await iHttp.get(link);
    return { status: "Ok", goodlinks: [`${newUrl.origin}${newUrl.pathname}`] };
  } catch (error) {
    setBaseUrl(newUrl.origin);
    let originPoint = newUrl.pathname.split("/").reverse()[0];
    originPoint = originPoint !== "" ? originPoint : "/";
    const aNb = newUrl.pathname.split("/").reverse()[0].match(/\d+/g);
    let qparams = aNb ? [originPoint, aNb.join(" ")] : [originPoint];
    let found = {};
    let products = [];

    for (let i = 0; i < qparams.length; i++) {
      found = await iHttp.get(
        `/search/suggest.json?q=${qparams[i]}&resources[type]=product&resources[options][fields]=title,body`
      );
      products = found.data.resources.results.products;
      if (products.length === 1) {
        const nUrl = products[0].url.split("?")[0];
        return {
          status: error.message,
          goodlinks: [`${newUrl.origin}${nUrl}`],
        };
      }
    }

    return {
      status: error.message,
      // goodlinks: [newUrl.origin],
      goodlinks: ["/"],
    };
  }
};

module.exports = checkLink;
