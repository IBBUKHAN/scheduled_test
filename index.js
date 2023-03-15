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
//     Referer: "https://assistant.corover.mobi/irctc/chatAllbotData[bot].html",
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

async function BotQuery()
{

console.log(AllbotData);
 for(let bot in AllbotData)
 {
    console.log(AllbotData[bot]);

    var axiosConfig = {
      headers: {
        'app-id': AllbotData[bot]["app-id"], 
        'auth-Key': AllbotData[bot]["auth-key"], 
        'partner-key': AllbotData[bot]["partner-key"], 
        "authkey":AllbotData[bot].authkey,
      }
    };
    if(AllbotData[bot].appid)
    {
     axiosConfig.headers['appid']= AllbotData[bot].appid;
    }

    let payload = {};
    if (AllbotData[bot]["bot-type"] == "news-bot") {
      payload = { query: "aGVsbG8=", channel: AllbotData[bot].channel, inputType: "TEXT" };
    } else if (AllbotData[bot]["bot-type"] == "video-bot") {
      payload = JSON.stringify({
        query: "hello",
        app_name: AllbotData[bot]["app-name"],
        partner: AllbotData[bot].partner,
        channel: AllbotData[bot].channel,
        selected_question: AllbotData[bot].selected_question
      });
    } else if (AllbotData[bot]["bot-type"] == "node") {
      var axiosConfig = {
        headers: {
          "appid": AllbotData[bot]["appid"],
          "authkey": AllbotData[bot].authkey,
          "content-type": AllbotData[bot]["content-type"],
          "partner-key": AllbotData[bot]["partner-key"],
        }
      };
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
console.log(AllbotData[bot].url,
  payload,
  axiosConfig)
    try{
      const response =
        await axios
          .post(
            AllbotData[bot].url,
            payload,
            axiosConfig
          )
          .then(async (res) => {
            // console.log(res)
            result = res;
          });
      
        if (result.data) {
          console.log("voice =>", result.data);
        } 
      // console.log('Response:', response.data);
    }
    catch(error){
        console.log("Error:", error.message);
        notWorking.push(AllbotData[bot].Client_Name);
    }
  }

  console.log(notWorking)
}


BotQuery();
// const job = schedule.scheduleJob('* * * * *', function(){
//    testing();
// });



// const checking=async ()=>{
//   try{
//     console.log("Kamlsh")
//     let res= await axios.post("https://carandbike.corover.ai/contextapi/bot/sendQuery/en", {

//         "query": "hello",
//         "source": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
//         "inputType": "TEXT",
//         "userToken": "d2a0b077-e0eb-4376-9f91-26db458b3c45"
    
//     }, {
//       headers: {
//         "app-id": "304d27e6-4dca-4509-803d-5511874d9707",
//     "content-type": "application/json",
//     "partner-key": "cc94f34215b8f50e4",
//     // "Content-Length":null,
//     // "Host":null
//       },
//     });

//     console.log(res);
//   }
//   catch(error){
//     console.log("error: ", error.message);
//   }
// }

// checking();






// var data = JSON.stringify({
//   "query": "aGVsbG8=",
//   "channel": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
//   "inputType": "TEXT",
//   "audioUrl": null,
//   "contextLable": null,
//   "userToken": null,
//   "cxpayload": null
// });

// var config = {
//   method: 'post',
//   url: 'https://aibot.corover.ai/websiteAPI/getAnswer?languageCode=en',
//   headers: { 
//     'Accept': 'application/json, text/plain, */*', 
//     'Accept-Language': 'en-US,en;q=0.9', 
//     'Cache-Control': 'max-age=31536000', 
//     'Connection': 'keep-alive', 
//     'Content-Type': 'application/json', 
//     'Cookie': '__gads=ID=8edede95c5d1e263-22ade89144d90067:T=1673520798:RT=1673520798:S=ALNI_MYDKuApDTLlGmUAU3xyqjpfZ5S2Jg; _ga=GA1.2.1491232193.1673445649; _gid=GA1.2.990939727.1678690215; __gpi=UID=00000ba2ee8a6908:T=1673520798:RT=1678690219:S=ALNI_MZ8UqhULrWK-br0BlSCOjlaDoMy_g; _ga_31HCNKHEBE=GS1.1.1678712354.18.0.1678712354.0.0.0', 
//     'Origin': 'https://aibot.corover.ai', 
//     'Pragma': 'no-cache', 
//     'Referer': 'https://aibot.corover.ai/website/', 
//     'Sec-Fetch-Dest': 'empty', 
//     'Sec-Fetch-Mode': 'cors', 
//     'Sec-Fetch-Site': 'same-origin', 
//     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 
//     'app-id': '05955806-d488-11e9-bb65-2a2ae2dbcce4', 
//     'appid': '6af707a1-457a-4d42-ac30-f2e6a1fda747', 
//     'auth-Key': '05955df6-d488-11e9-bb65-2a2ae2dbcce4', 
//     'partner-key': 'dec1ba0b3b9c805e4', 
//     'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"', 
//     'sec-ch-ua-mobile': '?0', 
//     'sec-ch-ua-platform': '"macOS"'
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });


