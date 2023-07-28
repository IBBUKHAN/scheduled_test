const fs = require("fs");
const csv = require("csv-parser");
const { Pool } = require("pg");
const dbConfig = {
  user: "postgres",
  host: "35.200.249.148",
  database: "postgres",
  password: "Admin@2023",
  port: 5432,
};

const csvFilePath = "C:/Users/Ibbu/Downloads/yo.csv";

function readCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function insertData(data) {
  const pool = new Pool(dbConfig);

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    //column names original case mei rahe
    const keys = Object.keys(data[0]);
    // console.log("Column names:", keys);

    for (const record of data) {
      const values = keys.map((key) => {
        const value = record[key];
        return value !== "" ? value : null;
      });

      const placeholders = keys.map((_, i) => `$${i + 1}`).join(",");
      const columns = keys.map((key) => `"${key}"`).join(",");

      const query = {
        text: `INSERT INTO sebi.knowledge_base(${columns}) VALUES(${placeholders})`,
        values,
      };

      await client.query(query);
    }

    await client.query("COMMIT");
    console.log("Data inserted successfully!");
  } catch (err) {
    console.error("Error inserting data:", err);
  } finally {
    pool.end();
  }
}

readCSVFile(csvFilePath)
  .then((data) => insertData(data))
  .catch((err) => console.error("Error reading CSV file:", err));
