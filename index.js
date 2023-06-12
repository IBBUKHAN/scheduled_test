const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
const dbConfig = {
          user: "corover_prod",
          host: "prodbinstance.ch4ne6pszkn4.ap-south-1.rds.amazonaws.com",
          database: "postgres",
          password: "CoroverAWS",
          port: 5432,
};

const csvFilePath = 'C:/Users/Ibbu/Documents/GitHub/scheduled_test/lic_offices.csv';

function readCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function insertData(data) {
  const pool = new Pool(dbConfig);

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    for (const record of data) {
      const keys = Object.keys(record);
      const values = Object.values(record);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
      const columns = keys.join(',');

      const query = {
        text: `INSERT INTO nlp.lic_offices(${columns}) VALUES(${placeholders})`,
        values,
      };

      await client.query(query);
    }

    await client.query('COMMIT');
    console.log('Data inserted successfully!');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    pool.end();
  }
}

readCSVFile(csvFilePath)
  .then((data) => insertData(data))
  .catch((err) => console.error('Error reading CSV file:', err));
