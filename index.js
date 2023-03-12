const schedule = require("node-schedule");
const axios = require("axios");
let AllbotData = require("./coroverBotInfo.json");

// let axiosConfig = {
//   headers: {
//     "Access-Control-Allow-Origin": "*",
//     Connection: "keep-alive",
//     "auth-Key": "2b5fb5d4-0753-4302-b661-f8580e9effb0",
//     "sec-ch-ua-mobile": "?0",
//     "User-Agent":
//       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
//     "Content-Type": "application/json",
//     Accept: "application/json, text/plain, */*",
//     "Cache-Control": "max-age=31536000",
//     "app-id": "29fd4f94-f793-4227-9588-056b5ffb1318",
//     "Sec-Fetch-Site": "same-origin",
//     "Sec-Fetch-Mode": "cors",
//     "Sec-Fetch-Dest": "empty",
//     Referer: "https://assistant.corover.mobi/irctc/chatbot.html",
//     "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
//   },
// };

// const job = schedule.scheduleJob('* * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
// });

//console.log(AllbotData);

// const func = async () => {
//   await axios
//     .post(
//       "https://assistant.corover.mobi/nlpAPI/convertRealTimeAudio",
//       payload,
//       axiosConfig
//     )
//     .then(async (res) => {
//       result = res;
//     });

//   if (result.data) {
//     console.log("voice =>", result.data);
//   } else {
//   }
// };

const notWorking = [];

const testing = () => {
  AllbotData.map(async (bot) => {
    //console.log(bot.Client_Name);

    let axiosConfig = {
      headers: {
        "app-id": bot["app-id"],
        "auth-key": bot["auth-key"],
        "authkey": bot.authkey,
        "content-type": bot["content-type"],
        "partner-key": bot["partner-key"],
      },
    };

    let payload = {};
    if (bot["bot-type"] == "news-bot") {
      payload = { query: "aGVsbG8=", channel: bot.channel, inputType: "TEXT" };
    } else if (bot["bot-type"] == "video-bot") {
      payload = {
        query: "hello",
        app_name: bot["app-name"],
        partner: bot.partner,
        channel: bot.channel,
        selected_question: bot.selected_question
      };
    } else if (bot["bot-type"] == "node") {
      payload = {
        query: "hello",
        source:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        inputType: "TEXT",
        // next_context: null,
        // audioUrl: null,
        // contextLable: null,
        userToken: "a1a68c55-6ee5-4248-a6b7-796885388a67",
        // cxpayload: null,
        // cxInfo: null,
      };
    } else {
      console.log("bot-type is different");
    }

    try{
      const response = await axios.post(bot.URL, payload, axiosConfig);
      console.log('Response:', response.data);
    }
    catch(error){
        console.log("Error:", error.message);
    }

  });
};


//testing();
// const job = schedule.scheduleJob('* * * * *', function(){
//    testing();
// });



const checking=async ()=>{
  try{
    let res= await axios.post("https://carandbike.corover.ai/contextapi/bot/sendQuery/en", {

        "query": "hello",
        "source": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "inputType": "TEXT",
        "userToken": "d2a0b077-e0eb-4376-9f91-26db458b3c45"
    
    }, {
      headers: {
        "app-id": "304d27e6-4dca-4509-803d-5511874d9707",
    "content-type": "application/json",
    "partner-key": "cc94f34215b8f50e4",
    // "Content-Length":null,
    // "Host":null
      },
    });

    console.log(res);
  }
  catch(error){
    console.log("error: ", error.message);
  }
}

checking();

