const schedule = require("node-schedule");
const axios = require("axios");
// let AllbotData = require("./coroverBotInfo.json");
const { Pool } = require('pg');
var AllbotData;
 const pool = new Pool({user: 'corover_prod',host: 'prodbinstance.ch4ne6pszkn4.ap-south-1.rds.amazonaws.com',database: 'postgres',password: 'CoroverAWS', port: 5432});
 pool.query('SELECT * FROM nlp.scheduler_data', (error, results) => {if (error) {throw error; }
AllbotData = results.rows;
 console.log(results.rows);
 pool.end();});
;

const notWorking = [];

async function BotQuery()
{

// console.log(AllbotData);
 for(let bot in AllbotData)
 {

console.log(AllbotData[bot].answerkey_url,
  AllbotData[bot].payload,
  AllbotData[bot].headers)
    try{
      const response =
        await axios
          .post(
            AllbotData[bot].answerkey_url,
            AllbotData[bot].payload,
            {
              headers:AllbotData[bot].headers
              
            }
            
            )
            
          .then(async (res) => {
            console.log(res)
            result = res;
          });
      
        if (result.payload) {
          console.log("voice =>", result.payload);
        } 
      // console.log('Response:', response.data);
    }
    catch(error){
        console.log("Error:", error.message);
        notWorking.push(AllbotData[bot].client_name);
    }
  }
  

  console.log(notWorking)
}

BotQuery();

