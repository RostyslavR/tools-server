const path = require("path");
const fs = require("fs/promises");

const { headersCSV } = require("../../lib/fileCSV");

const { FILE_DIR } = require("../../config");

const csvPrepare = async (req, res) => {
  let files = await fs.readdir(FILE_DIR);
  files.forEach(async (file) => await fs.unlink(path.join(FILE_DIR, file)));

  await Promise.all(
    req.files.map(async (file) => {
      const [fExt, fName] = file.originalname.split(".").reverse();
      const fileName = `${fName}_src.${fExt}`;
      const filePath = path.join(FILE_DIR, fileName);
      await fs.rename(file.path, filePath);
    })
  );

  files = await fs.readdir(FILE_DIR);

  const headers = [
    "Email",
    "Phone",
    "First Name",
    "Last Name",
    "Country",
    "Zip",
  ];

  const fields = await headersCSV(path.join(FILE_DIR, files[0]));
  const etalon = JSON.stringify(fields);
  difStructure = false;
  await Promise.all(
    files.map(async (file) => {
      const headers = await headersCSV(path.join(FILE_DIR, file));
      if (JSON.stringify(headers) !== etalon) {
        difStructure = true;
      }
    })
  );

  return res.json({ status: "Ok", files, headers, fields, difStructure });
  // return res.json("Ok");
};

module.exports = csvPrepare;
