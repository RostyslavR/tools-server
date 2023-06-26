const path = require("path");
const fs = require("fs/promises");
const { FILE_DIR } = require("../../config");

const putFile = async (req, res) => {
  let files = await fs.readdir(FILE_DIR);
  files.map(async (file) => await fs.unlink(path.join(FILE_DIR, file)));

  const [fExt, fName] = req.file.originalname.split(".").reverse();
  const fileName = `${fName}_src.${fExt}`;
  const filePath = path.join(FILE_DIR, fileName);
  await fs.rename(req.file.path, filePath);

  // return res.json({ fileName });
  files = await fs.readdir(FILE_DIR);
  return res.json({ status: "Ok", fileList: files });
};

module.exports = putFile;
