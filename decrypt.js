const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const CryptoJS = require("crypto-js");

function encrypt(mobile_number) {
  return CryptoJS.AES.encrypt(
    mobile_number.toString(),
    "yC7N9P3idg05oJV7"
  ).toString();
}

async function main() {
  const output = [];

  fs.createReadStream("C:/Users/Ibbu/Downloads/Active.csv")
    .pipe(csv())
    .on("data", (row) => {
      const id = row.id;
      const username = row.name;
      const mobile_number = row.mobile_number;
      const result = encrypt(mobile_number);

      output.push({
        id: id,
        name: username,
        mobile_number: result,
      });
    })
    .on("end", () => {
      const csvWriter = createCsvWriter({
        path: "C:/Users/Ibbu/Downloads/decrypt.csv",
        header: [
          { id: "id", title: "id" },
          { id: "name", title: "name" },
          { id: "mobile_number", title: "mobile_number" },
        ],
      });

      csvWriter
        .writeRecords(output)
        .then(() => {
          console.log("CSV file successfully written to decrypt.csv");
        })
        .catch((err) => {
          console.error("Error writing CSV:", err);
        });
    });
}

main();
