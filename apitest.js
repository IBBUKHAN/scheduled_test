const axios = require("axios"); // Import Axios if you're using Node.js

async function roomType(roomdto) {
  try {
    console.log("==<", roomdto);

    const { propertyId, category } = roomdto;
    const authToken = "UL-COROVER";

    const payload = { propertyId, category }; // Simplified object shorthand

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": authToken,
    };

    const axiosConfig = { headers };

    const response = await axios.post(
      "https://api-next.devbeta.in/v1/corover/roomCategory",
      payload,
      axiosConfig
    ); // Replace example.com with your actual endpoint URL

    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Error:", error.response.data); // Log error message
    throw error; // Re-throw the error to handle it in the caller function
  }
}

// Example usage
const roomdto = { propertyId: "5ae6e44e4bee7a2b86e1f5d1", category: "Ensuite" };
roomType(roomdto)
  .then((data) => console.log("Response data:", data))
  .catch((error) => console.error("Error:", error.message));
