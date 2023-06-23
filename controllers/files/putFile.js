const path = require("path");
const fs = require("fs/promises");
const { FILE_DIR } = require("../../config");

const putFile = async (req, res) => {
  const files = await fs.readdir(FILE_DIR);
  files.map(async (file) => await fs.unlink(path.join(FILE_DIR, file)));

  const [fExt, fName] = req.file.originalname.split(".").reverse();
  const filename = `${fName}_src.${fExt}`;
  const filePath = path.join(FILE_DIR, filename);
  await fs.rename(req.file.path, filePath);

  return res.json(req.file);
};

module.exports = putFile;
