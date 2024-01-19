const { Client, Pool } = require("pg");
const fs = require("fs");
const csv = require("csv-parser");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: "postgres",
  password: process.env.DB_PASSWORD,
  schema: "nlp",
  port: 5432,
};

const tableName = "ul_roomDetails";
const csvFilePath = "C:/Users/Ibbu/Downloads/RoomDetails.csv";

async function createTableAndDefineColumns() {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    await client.query("CREATE SCHEMA IF NOT EXISTS nlp;");

    const columns = await getColumnsFromCsv(csvFilePath);

    const columnDefinitions = columns
      .map((column) => `"${column}" VARCHAR(5000)`)
      .join(", ");

    const createTableQuery = `CREATE TABLE IF NOT EXISTS nlp.${tableName} (${columnDefinitions})`;
    await client.query(createTableQuery);

    console.log(`Table "nlp.${tableName}" created successfully.`);

    const data = await getDataFromCsv(csvFilePath);
    await insertData(data);

    console.log(`Data inserted into "nlp.${tableName}" successfully.`);
  } catch (error) {
    console.error("Error:", error.stack || error);
  } finally {
    try {
      await client.end();
      console.log("Database connection closed successfully.");
    } catch (error) {
      console.error("Error closing database connection:", error.stack || error);
    }
  }
}

async function getColumnsFromCsv(filePath) {
  return new Promise((resolve, reject) => {
    const columns = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headers) => {
        headers.forEach((columnName) => {
          columns.push(columnName);
        });

        resolve(columns);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function getDataFromCsv(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function insertData(data) {
  const pool = new Pool(dbConfig);

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    const keys = Object.keys(data[0]);

    for (const record of data) {
      const values = keys.map((key) => {
        const value = record[key];
        return value !== "" ? value : null;
      });

      const placeholders = keys.map((_, i) => `$${i + 1}`).join(",");
      const columns = keys.map((key) => `"${key}"`).join(",");

      const query = {
        text: `INSERT INTO nlp.${tableName}(${columns}) VALUES(${placeholders})`,
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

createTableAndDefineColumns();
