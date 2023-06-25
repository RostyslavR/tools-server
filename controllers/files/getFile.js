const fs = require("fs/promises");
const path = require("path");
const { glob } = require("glob");
const XLSX = require("xlsx");
const XlsxPopulate = require("xlsx-populate");
const isValidUrl = require("../../lib/isValidUrl");
const { FILE_DIR } = require("../../config");
const checkLink = require("../../services/shopify/checkLink");

const cellsToLinks = async (file) => {
  const workbook = await XlsxPopulate.fromFileAsync(file);
  const sheet = workbook.sheet(0);

  sheet.usedRange().forEach((cell) => {
    const value = cell.value();
    if (typeof value === "string" && value.startsWith("http")) {
      cell.hyperlink(value);
      cell.style({ fontColor: "0000FF", underline: true });
    }
    if (value === "Ok") {
      cell.style({ fontColor: "03AC13" });
    }
    if (value === "/") {
      cell.style({ fontColor: "FF0FF0" });
    }
  });

  await workbook.toFileAsync(file);
  console.log("Conversion completed successfully.");
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getFile = async (req, res) => {
  const fileMask = `**/*_src.xlsx`;

  const mFiles = await glob(fileMask);
  const fileName = path.basename(mFiles[0]);

  const filePath = path.join(FILE_DIR, fileName);

  const [fExt, fName] = fileName.split(".").reverse();
  const f1Name = fName.split("_")[0];
  const newFileName = `${f1Name}_res.${fExt}`;
  const newFilePath = path.join(FILE_DIR, newFileName);

  let workBook = XLSX.readFile(filePath);
  let sheetName = workBook.SheetNames[0];
  let workSheet = workBook.Sheets[sheetName];
  let jsonData = XLSX.utils.sheet_to_json(workSheet, {
    header: 1,
    blankrows: false,
  });

  jsonData.unshift(["OldUrl"]);
  let newWorkSheet = XLSX.utils.json_to_sheet(jsonData, {
    skipHeader: true,
  });
  let newWorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkBook, newWorkSheet, sheetName);
  await XLSX.writeFile(newWorkBook, filePath);

  workBook = XLSX.readFile(filePath);
  sheetName = workBook.SheetNames[0];
  workSheet = workBook.Sheets[sheetName];

  jsonData = XLSX.utils.sheet_to_json(workSheet, {
    blankrows: false,
  });

  const filteredData = jsonData.filter((v) => v.OldUrl && isValidUrl(v.OldUrl));

  newWorkSheet = XLSX.utils.json_to_sheet(filteredData, {
    skipHeader: true,
  });
  newWorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkBook, newWorkSheet, sheetName);
  await XLSX.writeFile(newWorkBook, filePath);

  jsonData = [];
  for (let i = 0; i < filteredData.length; i++) {
    let { OldUrl } = filteredData[i];
    const result = await checkLink(OldUrl);
    let NewUrl = result.status === "Ok" ? result.status : result.goodlinks[0];
    jsonData.push({ OldUrl, NewUrl });

    if (!(i % 50) && i > 0) {
      await sleep(200000);
    }
  }

  newWorkSheet = XLSX.utils.json_to_sheet(jsonData);
  newWorkSheet["!cols"] = [{ wch: 60 }, { wch: 60 }];
  newWorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkBook, newWorkSheet, sheetName);
  await XLSX.writeFile(newWorkBook, newFilePath);

  cellsToLinks(newFilePath);

  const files = await fs.readdir(FILE_DIR);
  return res.json({ status: "Ok", fileList: files });
};

module.exports = getFile;
