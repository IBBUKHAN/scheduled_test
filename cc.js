const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

// API key from environment variables
const API_KEY = "ed2be1d4485d66f3e8814c23169fab4e";
const NUMVERIFY_BASE_URL = "http://apilayer.net/api/validate";

// Declare your phone number here
const myPhoneNumber = "9596980018"; // Replace with your actual phone number

// Function to fetch country information based on the phone number
const fetchCountryData = async (phoneNumber) => {
  try {
    const response = await axios.get(NUMVERIFY_BASE_URL, {
      params: {
        access_key: API_KEY,
        number: phoneNumber,
      },
    });

    const data = response.data;

    if (data.valid) {
      // Data to write to JSON file
      const countryData = {
        Country: data.country_name,
        Country_code: data.country_code,
        Dial_code: data.country_prefix,
        Carrier: data.carrier,
        Location: data.location,
      };

      // Write data to a JSON file
      fs.writeFile(
        "countryData.json",
        JSON.stringify(countryData, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing to JSON file:", err);
          } else {
            console.log("Data written to countryData.json");
          }
        }
      );
    } else {
      console.log("Invalid phone number provided.");
    }
  } catch (error) {
    console.error("Error fetching data from Numverify API:", error.message);
  }
};

// Run the function with your phone number
fetchCountryData(myPhoneNumber);
