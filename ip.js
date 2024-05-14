// Import the geoip-lite library
const geoip = require("geoip-lite");

// Function to fetch location and city name based on IP address using geoip-lite
function getLocationByIP(ipAddress) {
  // Get location data for the IP address
  const location = geoip.lookup(ipAddress);

  if (location) {
    // Extract relevant information
    const { city, region, country, ll } = location;
    const [latitude, longitude] = ll;

    // Output the information
    console.log(`City: ${city}`);
    console.log(`Region: ${region}`);
    console.log(`Country: ${country}`);
    console.log(`Latitude: ${latitude}`);
    console.log(`Longitude: ${longitude}`);
  } else {
    console.error("Location not found for the provided IP address.");
  }
}

// Example usage
const ipAddress = "103.57.86.36"; // Replace with the IP address you want to check
getLocationByIP(ipAddress);
