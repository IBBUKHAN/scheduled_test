const express = require("express");
const fs = require("fs").promises;
const Redis = require("ioredis");

const app = express();
const port = 3000;

const redis = new Redis();

function filterUniversities(universities, cities) {
  return universities.filter((university) => {
    const city = cities.find((city) => city.slug === university.citySlug);
    return city && city.enable;
  });
}

app.get("/filteredUniversities", async (req, res) => {
  try {
    const universityData = await redis.get("Universities");
    const CityData = await redis.get("City");

    const cachedData = await redis.get("FilteredUniversities");
    if (cachedData) {
      const cachedUniversityNames = JSON.parse(cachedData);
      console.log("Data retrieved from cache");
      return res.json(cachedUniversityNames);
    }

    const universities = JSON.parse(universityData);
    const cities = JSON.parse(CityData);

    if (universities && cities) {
      const filteredUniversities = filterUniversities(universities, cities);

      const uniqueUniversityNames = [
        ...new Set(filteredUniversities.map((university) => university.name)),
      ];

      await redis.set(
        "FilteredUniversities",
        JSON.stringify(uniqueUniversityNames)
      );

      return res.json(uniqueUniversityNames);
    } else {
      return res.status(500).json({
        error: "Error reading JSON files. Please check the file paths.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
