const fs = require("fs");
const express = require("express");
const { promisify } = require("util");
const csv = require("csv-parser");

async function readCSV(filePath) {
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
app.get("/filteredUniversities", async (req, res) => {
  async function filterUniversities() {
    try {
      const universityFilePath =
        "C:/Users/Ibbu/Downloads/uniliving_universitiescororvertest.csv";
      const cityFilePath =
        "C:/Users/Ibbu/Downloads/uniliving_citiestestcororver.csv";

      const [universities, cities] = await Promise.all([
        readCSV(universityFilePath),
        readCSV(cityFilePath),
      ]);

      const filteredUniversities = universities
        .filter((uni) => {
          const matchingCity = cities.find(
            (city) => city.slug === uni.citySlug
          );
          return matchingCity && matchingCity.enable;
        })
        .map((uni) => uni.name);

      console.log("Filtered Universities:", filteredUniversities);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  filterUniversities();

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
