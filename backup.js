const express = require("express");
const redis = require("redis");
const fs = require("fs");
const multer = require("multer");

const app = express();
const port = 3000;

const redisClient = require("./client");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post("/updateProperties", upload.single("jsonData"), (req, res) => {
  const { key } = req.body;
  const newData = req.file.buffer.toString();
  redisClient.get(key, (err, oldData) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching data from Redis" });
    }

    redisClient.set(key, newData, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error updating data in Redis" });
      }

      const backupFilePath = "./backups/ok.json";

      try {
        fs.writeFileSync(backupFilePath, oldData);
        return res
          .status(200)
          .json({ message: "Data updated successfully", backupFilePath });
      } catch (writeError) {
        return res
          .status(500)
          .json({ error: "Error creating backup file", writeError });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
