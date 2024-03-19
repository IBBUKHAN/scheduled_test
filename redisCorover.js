const Redis = require("ioredis");

const redis = new Redis({
  host: "cognocache.corover.ai",
  port: 6379,
  password: "8$@Wg2n#pLqZ",
});

// Testing the connection
redis.ping((err, result) => {
  if (err) {
    console.error("Error connecting to Redis:", err);
  } else {
    console.log("Connected to Redis. Ping result:", result);
  }
  // Check how many keys are there
  redis.keys("*", (err, keys) => {
    if (err) {
      console.error(`Error retrieving keys: ${err}`);
    } else {
      console.log("Keys in the Redis database:", keys);
    }
  });
  // Close the connection after testing
  redis.quit();
});
