const axios = require("axios");
const fs = require("fs");
let downtimeStart = null;
let uptimeStart = null;
// Function to check bot status
async function checkBotStatus() {
  try {
    const response = await axios.post(
      "https://risl.corover.ai/rislAPI/nlp/answer/en",
      {
        query: "Water Supply Complaint",
        source:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        inputType: "TEXT",
        userToken: "71124dc2-fb03-4935-bfc4-99384ad4e8f8",
      },
      {
        headers: {
          appid: "6b412d8f-f80e-460c-903e-b035e50c72f7",
          "content-type": "application/json",
          accept: "application/json, text/plain, */*",
        },
      }
    );
    return { status: "up", timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: "down", timestamp: new Date().toISOString() };
  }
}

// Function to log bot status
function logBotStatus(status, timestamp) {
  const logMessage = `${timestamp}: Bot is ${status}\n`;
  fs.appendFile("bot_status.log", logMessage, (err) => {
    if (err) throw err;
    console.log(logMessage); // Output to console
  });

  if (status === "down") {
    if (!downtimeStart) {
      downtimeStart = timestamp;
    }
    if (uptimeStart) {
      const uptimeEnd = timestamp;
      const uptimeInterval = `${uptimeStart} to ${uptimeEnd}\n`;
      fs.appendFile("uptime_records.log", uptimeInterval, (err) => {
        if (err) throw err;
      });
      uptimeStart = null;
    }
  } else {
    if (!uptimeStart) {
      uptimeStart = timestamp;
    }
    if (downtimeStart) {
      const downtimeEnd = timestamp;
      const downtimeInterval = `${downtimeStart} to ${downtimeEnd}\n`;
      fs.appendFile("downtime_records.log", downtimeInterval, (err) => {
        if (err) throw err;
      });
      downtimeStart = null;
    }
  }
}

// Scheduler function to periodically check bot status
function scheduleBotStatusCheck() {
  setInterval(async () => {
    const { status, timestamp } = await checkBotStatus();
    logBotStatus(status, timestamp);
  }, 60000); // Check bot status every 1 minute
}

// Start scheduler
scheduleBotStatusCheck();
