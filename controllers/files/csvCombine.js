const path = require("path");
const fs = require("fs/promises");

const { dataCSV, writeCSV } = require("../../lib/fileCSV");

const { FILE_DIR } = require("../../config");

const csvCombine = async (req, res) => {
  const { headers = [], fields = [] } = req.body;

  const resFilePath = path.join(FILE_DIR, "merge_res.csv");
  //   await fs.unlink(resFilePath);
  const header = [];
  for (let i = 0; i < headers.length; i++) {
    header.push({ id: fields[i], title: headers[i] });
  }

  const files = (await fs.readdir(FILE_DIR)).map((file) =>
    path.join(FILE_DIR, file)
  );

  const results = [];
  await Promise.all(
    files.map(async (file) => {
      const data = await dataCSV(file);
      results.push(...data);
    })
  );

  await writeCSV(results, header, resFilePath);

  return res.json({ status: "Ok", fileList: ["merge_res.csv"] });
  //   return res.json("Ok");
};

module.exports = csvCombine;
