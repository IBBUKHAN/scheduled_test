const redis = require("ioredis");
const fs = require("fs");

// const client = redis.createClient({
//   host: "cognocache.corover.ai",
//   port: 6379,
//   password: "8$@Wg2n#pLqZ",
// });

const client = require("./client");
client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error(`Redis error: ${err}`);
});

// client.get("Universities", (err, keys) => {
//   if (err) {
//     console.error(`Error retrieving keys: ${err}`);
//   } else {
//     console.log("Keys in the Redis database:", keys);
//   }

//   client.quit();
// });
async function StoreData() {
  try {
    const jsonFile = fs.readFileSync("./uniliving.properties.json", "utf8");
    const jsonData = JSON.parse(jsonFile);

    await client.set("PRO", JSON.stringify(jsonData));
    console.log("Data set in Redis");
    client.quit();
  } catch (error) {
    console.error(`Error storing data in Redis: ${error}`);
  }
}

StoreData();
