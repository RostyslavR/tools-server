const path = require("path");
const fs = require("fs/promises");

const { dataCSV, writeCSV } = require("../../lib/fileCSV");

const { FILE_DIR } = require("../../config");

const toTitleCase = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

const removeEmptyRow = (data) => {
  const result = [];

  data.map((item) => {
    const x = Object.values(item).find((e) => {
      return e !== "";
    });
    if (x !== undefined) {
      result.push(item);
    }
  });

  return result;
};

const changeValue = (data = [], vSetting = []) => {
  const result = [];
  return data.map((item) => {
    res = {};
    for (i = 0; i < vSetting.length; i++) {
      switch (vSetting[i].value) {
        case "LowerCase":
          res[vSetting[i].key] = item[vSetting[i].key].toLowerCase();
          break;
        case "UpperCase":
          res[vSetting[i].key] = item[vSetting[i].key].toUpperCase();
          break;
        case "TitleCase":
          res[vSetting[i].key] = toTitleCase(item[vSetting[i].key]);
          break;
      }
    }
    return { ...item, ...res };
  });
};

const csvCombine = async (req, res) => {
  const {
    headers = [],
    fields = [],
    removeEmptyRow: remEmptyRow = false,
    vSetting = [],
  } = req.body;

  const resFilePath = path.join(FILE_DIR, "merge_res.csv");
  const header = [];
  for (let i = 0; i < headers.length; i++) {
    header.push({ id: fields[i], title: headers[i] });
  }

  const files = (await fs.readdir(FILE_DIR)).map((file) =>
    path.join(FILE_DIR, file)
  );

  let results = [];
  await Promise.all(
    files.map(async (file) => {
      const data = await dataCSV(file);
      results.push(...data);
    })
  );

  await writeCSV(results, header, resFilePath);

  if (remEmptyRow === true) {
    let data = await dataCSV(resFilePath);
    data = removeEmptyRow(data);
    await writeCSV(data, header, resFilePath);
  }

  if (vSetting.length > 0) {
    let data = await dataCSV(resFilePath);
    data = changeValue(data, vSetting);
    await writeCSV(data, header, resFilePath);
  }

  return res.json({ status: "Ok", fileList: ["merge_res.csv"] });
  //   return res.json("Ok");
};

module.exports = csvCombine;
