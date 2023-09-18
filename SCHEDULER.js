const { Pool } = require("pg");
const axios = require("axios");
const moment = require("moment-timezone");

async function testBots() {
  try {
    const pool = new Pool({
      user: "postgres",
      host: "postgres.gcp.corover.ai",
      database: "postgres",
      password: "PVc)4tWX$oMB",
      port: 5432,
    });

    const timeZone = "Asia/Kolkata";
    const now = moment().tz(timeZone);
    const currentDate = now.format("YYYY-MM-DD");
    console.log(currentDate);

    const botDataQuery = "SELECT * FROM nlp.scheduler_data";
    const { rows: allBotData } = await pool.query(botDataQuery);

    for (const bot of allBotData) {
      console.log(`Bot Name: ${bot.client_name}`);
      try {
        let response;

        if (bot.id == 10) {
          response = await axios.get(bot.answerkey_url, {
            headers: JSON.parse(bot.headers),
          });
        } else {
          response = await axios.post(
            bot.answerkey_url,
            JSON.parse(bot.payload),
            {
              headers: JSON.parse(bot.headers),
            }
          );
        }

        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Bot not working");
        }
      } catch (error) {
        console.log(`Error for bot ${bot.client_name}:`, error.message);
      }
    }

    console.log("Done processing bots.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Call the function to start testing bots
testBots();
