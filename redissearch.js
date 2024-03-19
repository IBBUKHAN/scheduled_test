const client = require("./client");

const search = "glassworks";

client.get("Properties", async (err, data) => {
  try {
    if (err) {
      throw err;
    }

    const jsonData = data ? JSON.parse(data) : null;
    const propertyMap = new Map();
    jsonData?.forEach((item) => {
      propertyMap.set(item.propertySlug, item);
    });

    const result = propertyMap.get(search);

    if (result) {
      console.log(`Distance: ${result.driving.distance.text}`);
      console.log(`Duration: ${result.driving.duration.text}`);
      console.log(`Address: ${result.driving.start_address}`);
    } else {
      console.log(`Object not found with propertySlug: ${search}`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  } finally {
    client.quit();
  }
});
