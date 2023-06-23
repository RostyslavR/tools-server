const checkLink = require("../../services/shopify/checkLink");

const check = async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.json({ status: "No URL", goodlinks: [] });
  }
  try {
    const result = await checkLink(link);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.json({ status: error.message, goodlinks: [] });
  }
};
module.exports = check;
