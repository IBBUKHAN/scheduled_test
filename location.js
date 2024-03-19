const fetch = require("node-fetch");

async function getLocationDetails(latitude, longitude) {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.display_name) {
      console.log(`Location: ${data.display_name}`);
    } else {
      console.error(`Error: Unable to retrieve location details`);
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

const latitude = -3.2118524;
const longitude = 55.9444012;

getLocationDetails(latitude, longitude);
