const fs = require("fs");

// Read input data from file
const inputData = JSON.parse(
  fs.readFileSync("./previous_universities.json", "utf8")
);

// Convert to array of strings
const outputData = inputData.map((item) => item.value);

// Write output data to new file
fs.writeFileSync("./convert.json", JSON.stringify(outputData, null, 2), "utf8");

console.log("Conversion complete. Data written to convert.json.");
