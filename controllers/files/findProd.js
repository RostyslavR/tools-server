const { setBaseUrl } = require("../../services/iAxios");
const findProducts = require("../../services/shopify/findProducts");

const findProd = async (req, res) => {
  const { link, qParams } = req.body;
  const newUrl = new URL(link);
  const { origin } = newUrl;

  setBaseUrl(origin);

  try {
    const result = await findProducts(qParams);

    const productUrls = result.map((url) => `${origin}${url}`);

    return res.json({ status: "Ok", products: productUrls });
  } catch (error) {
    return res.json({ status: error.message, products: ["errorrrrrr"] });
  }
};
module.exports = findProd;
