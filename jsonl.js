const { writeFileSync, readFileSync } = require("fs");
const converter = require("json-2-csv");

// Function to read JSON data
const readJSON = (filePath) => JSON.parse(readFileSync(filePath, "utf-8"));

// Step 1: Process properties
const properties = readJSON("./properties2.json")
  .filter((elem) => elem.name)
  .map((elem) => ({
    question: elem.name.trim(),
    answer: elem.propertyId.trim(),
    type: "PROPERTY",
    country: "NA",
    city: "NA",
    countrySlug: "NA",
    citySlug: "NA",
    displayName: elem.name.trim(),
    level: 4,
  }));
console.log(`Total properties: ${properties.length}`);

// Step 2: Process cities from ul_cities.json instead of ul_cities.csv
const cities = readJSON("./ul_cities.json")
  .filter((elem) => elem.name && elem.slug && elem.country && elem.countrySlug)
  .map((elem) => ({
    question: elem.name.trim(),
    answer: elem.slug.trim(),
    type: "CITY",
    country: elem.country.trim(),
    city: elem.name.trim(),
    countrySlug: elem.countrySlug.trim(),
    citySlug: elem.slug.trim(),
    displayName: elem.name.trim(),
    level: 3,
  }));
console.log(`Total cities: ${cities.length}`);

// Step 3: Process campuses from ul_campus.json instead of ul_campus.csv
const campuses = readJSON("./ul_campus.json")
  .filter((elem) => elem.displayName && elem.slug)
  .map((elem) => ({
    question: elem.displayName.trim(),
    answer: elem.slug.trim(),
    type: "CAMPUS",
    country: elem.country.trim(),
    city: elem.city.trim(),
    countrySlug: elem.countrySlug.trim(),
    citySlug: elem.citySlug.trim(),
    displayName: elem.displayName.trim(),
    level: 2,
  }));
console.log(`Total campuses: ${campuses.length}`);

// Step 4: Process universities from ul_university.json instead of ul_university.csv
const universities = readJSON("./ul_university.json")
  .filter((elem) => elem.displayName && elem.slug)
  .map((elem) => ({
    question: elem.displayName.trim(),
    answer: elem.slug.trim(),
    type: "UNIVERSITY",
    country: elem.country.trim(),
    city: elem.city.trim(),
    countrySlug: elem.countrySlug.trim(),
    citySlug: elem.citySlug.trim(),
    displayName: elem.displayName.trim(),
    level: 1,
  }));
console.log(`Total universities: ${universities.length}`);

// Combine all the data
const finalData = [...universities, ...campuses, ...cities, ...properties];

// Print total count of combined data
console.log(`Total entries in final data: ${finalData.length}`);

// Write the combined data to JSON, JSONL, and CSV files
writeFileSync("./ul_data.json", JSON.stringify(finalData, null, 2));
writeFileSync(
  "./ul_data.jsonl",
  finalData.map((elem) => JSON.stringify(elem)).join("\n")
);

// Convert finalData to CSV format using json-2-csv
converter.json2csv(finalData, (err, csv) => {
  if (err) {
    console.error("Error converting to CSV:", err);
    return;
  }
  writeFileSync("./ul_data.csv", csv);
});
