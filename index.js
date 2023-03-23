const schedule = require("node-schedule");
const axios = require("axios");
// let AllbotData = require("./coroverBotInfo.json");
const { Pool } = require("pg");
var AllbotData;
var id = require("pg");
const notWorking = [];
const job = schedule.scheduleJob("0 * * * *", function () {
  async function BotQuery() {
    const pool = new Pool({
      user: "corover_prod",
      host: "prodbinstance.ch4ne6pszkn4.ap-south-1.rds.amazonaws.com",
      database: "postgres",
      password: "CoroverAWS",
      port: 5432,
    });
    temp = await pool.query("SELECT * FROM nlp.scheduler_data");
    AllbotData = temp.rows;
    for (let bot in AllbotData) {
      console.log(AllbotData[bot].client_name);
      try {
        if (AllbotData[bot].id == 10) {
          const response = await axios
            .get(AllbotData[bot].answerkey_url, {
              headers: JSON.parse(AllbotData[bot].headers),
            })
            .then(async (res) => {
              // console.log(res)
              // result = res;
            });
        } else {
          const response = await axios
            .post(
              AllbotData[bot].answerkey_url,
              JSON.parse(AllbotData[bot].payload),
              {
                headers: JSON.parse(AllbotData[bot].headers),
              }
            )
            .then(async (res) => {
              // console.log(res)
              //  result = res;
            });
        }
      } catch (error) {
        console.log("Error:", error.message);
        notWorking.push(AllbotData[bot].client_name);
      }
    }
    //Email notitication system
    var email_payload = {
      subject: "Bot is down",
      htmldata: "Please find attached the DigiSaathi report for",
      to: ["kamlesh@corover.ai"],
    };
    let userdata = await pool.query(
      "select array_agg(emailid) from nlp.scheduler_userdata"
    );
    // console.log(userdata)
    let allBOTuserdata = userdata.rows[0].array_agg;
    email_payload.subject = "BOT DOWN ALERT !!!!!";
    if (notWorking.length == 1) {
      email_payload.htmldata = `The  Bots which is down &#9888: ${notWorking.join(
        ", "
      )}.`;
    } else {
      email_payload.htmldata = `The lists of Bots that are down are &#9888: ${notWorking.join(
        ", "
      )}.`;
    }

    email_payload.to = allBOTuserdata;
    if (notWorking.length == 0) {
      console.log("All Bots are working successfully");
    } else {
      console.log(email_payload);
      const response = await axios
        .post(
          "https://techyoto.corover.ai/techyotoAPI/bot/sendemail",
          email_payload,
          {
            headers: { appId: "582fa2ed-c990-413e-bffa-3be75b7a7296" },
          }
        )
        .then(async (res) => {
          // console.log(res)
          // result = res;
        });
    }
    // console.log(notWorking);
  }
  BotQuery();
});
