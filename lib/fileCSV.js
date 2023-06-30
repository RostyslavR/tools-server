const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const headersCSV = async (filePath, separator = ",") => {
  const results = [];
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator }))
        .on("headers", (headers) => {
          results.push(...headers);
        })
        .on("data", (data) => {})
        .on("end", () => {
          resolve();
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  } catch (error) {
    console.error(error);
  }
  return results;
};

const dataCSV = async (filePath, separator = ",") => {
  const results = [];
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator }))
        .on("data", (data) => results.push(data))
        .on("end", () => {
          resolve();
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  } catch (error) {
    console.error(error);
  }
  return results;
};

const writeCSV = async (data = [], header = [], path = undefined) => {
  if (path) {
    const csvWriter = createCsvWriter({
      path,
      header,
    });
    try {
      await csvWriter.writeRecords(data);
    } catch (error) {
      console.log(error);
    }
  }
};
module.exports = { headersCSV, dataCSV, writeCSV };
