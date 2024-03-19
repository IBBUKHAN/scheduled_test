const express = require("express");
const redis = require("redis");
const client = require("./client");

const app = express();
const port = 3000;

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error(`Redis error: ${err}`);
});

const cache = {};

app.get("/property/:propertySlug", (req, res) => {
  const propertySlug = req.params.propertySlug;

  if (cache[propertySlug]) {
    console.log(`Data for ${propertySlug} found in cache`);
    return res.json(cache[propertySlug]);
  }

  client.send_command("JSON.GET", ["Properties", "."], (err, result) => {
    if (err) {
      console.error(`Error retrieving data from Redis: ${err}`);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(result);

    const property = jsonData.find((p) => p.propertySlug === propertySlug);

    if (property) {
      const { driving } = property;
      if (driving) {
        const response = {
          drivingDistanceText: driving.distance.text,
          startAddress: driving.start_address,
        };
        cache[propertySlug] = response;

        res.json(response);
      } else {
        res.json({
          message: "Driving information not available for the property",
        });
      }
    } else {
      res.status(404).json({
        message: `Property with propertySlug '${propertySlug}' not found`,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
