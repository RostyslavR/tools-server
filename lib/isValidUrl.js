const isValidUrl = (link) => {
  let newUrl;

  try {
    newUrl = new URL(link);
  } catch (_) {
    return false;
  }

  return newUrl.protocol === "http:" || newUrl.protocol === "https:";
};
module.exports = isValidUrl;
