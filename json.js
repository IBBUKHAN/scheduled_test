const redis = require("redis");
const fs = require("fs");
const client = require("./client");

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error(`Redis error: ${err}`);
});

async function storeData() {
  const jsonFile = fs.readFileSync("./uniliving.cities.json", "utf8");
  const jsonData = JSON.parse(jsonFile);

  client.send_command(
    "JSON.SET",
    ["JSONDATA", ".", JSON.stringify(jsonData)],
    (err, result) => {
      if (err) {
        console.error(`Error setting data in Redis: ${err}`);
      } else {
        console.log("Data set in Redis");
        client.quit();
      }
    }
  );
}

storeData();
