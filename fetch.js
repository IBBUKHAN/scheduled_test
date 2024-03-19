const { readFile } = require("fs").promises;

async function fetchDataFromFile(filePath) {
  try {
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
    throw error;
  }
}

async function fetchFilteredData(slugToFilter) {
  const files = ["./uniliving.distance_matrixes.json"];
  const dataPromises = files.map(fetchDataFromFile);

  try {
    const allDataArrays = await Promise.all(dataPromises);
    const allData = [].concat(...allDataArrays);
    const filteredData = allData.filter(
      (item) => item.propertySlug === slugToFilter
    );
    console.log(`Data with slug "${slugToFilter}":`, filteredData);
  } catch (error) {
    console.error("Error fetching or filtering data:", error.message);
  }
}

fetchFilteredData("glassworks");
