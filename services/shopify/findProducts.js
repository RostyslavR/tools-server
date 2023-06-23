const { iHttp } = require("../iAxios");

const findProducts = async (qparams) => {
  try {
    found = await iHttp.get(
      `/search/suggest.json?q=${qparams}&resources[type]=product&resources[options][fields]=title,body`
    );

    products = found.data.resources.results.products;
    const prodactUrls = products.map((product) => product.url.split("?")[0]);
    return prodactUrls;
  } catch (error) {
    console.log("err");
    return [];
  }
};
module.exports = findProducts;
