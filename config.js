const path = require("path");

const SERVER_DIR = __dirname;
const TMP_DIR = path.join(__dirname, "tmp");
// const FILE_DIR = path.join(__dirname, "public", "files");
const FILE_DIR = path.join(__dirname, "public");

module.exports = {
  SERVER_DIR,
  TMP_DIR,
  FILE_DIR,
};
