const fs = require("fs");

function loadAndParseJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return null;
    }

    const data = fs.readFileSync(filePath, "utf8");
    console.log("File read successfully:", filePath);

    const parsedData = JSON.parse(data);
    if (!parsedData || typeof parsedData !== "object") {
      throw new Error("Parsed data is not an object or is null");
    }

    return parsedData;
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    return null;
  }
}

function validateJSON(data) {
  if (!Array.isArray(data)) {
    console.error("Invalid JSON format: Expected an array.");
    return false;
  }
  for (const item of data) {
    if (typeof item !== "object" || item === null) {
      console.error("Invalid item in JSON data:", item);
      return false;
    }
    if (!item._id) {
      console.error("Missing required field '_id' in JSON item:", item);
      return false;
    }
    if (!item.propertyFeatures || !Array.isArray(item.propertyFeatures)) {
      console.error(
        "Invalid or missing 'propertyFeatures' in JSON item:",
        item
      );
      return false;
    }
  }
  return true;
}

function mapAndStoreData(data, outputFilePath) {
  const mappedData = data.map((item) => ({
    _id: item._id,
    name: item.name,
    citySlug: item.citySlug,
  }));

  fs.writeFileSync(outputFilePath, JSON.stringify(mappedData, null, 2), "utf8");
  console.log("Data mapped and stored in:", outputFilePath);
}

function processData(inputFilePath, outputFilePath) {
  const data = loadAndParseJSON(inputFilePath);
  if (data) {
    if (validateJSON(data)) {
      console.log("JSON data is valid.");
      mapAndStoreData(data, outputFilePath);
    } else {
      console.error("JSON validation failed.");
    }
  } else {
    console.error("Failed to load or parse JSON data.");
  }
}

processData("./utterances.json", "./outputfile.json");
