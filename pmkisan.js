const axios = require("axios");
const fs = require("fs");
const json = require("./audiosebi.json");

async function voiceapi(payload) {
  let result;
  const axiosConfig = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "Cache-Control": "max-age=31536000",
      appId: "0708775d-c6af-4a88-ac47-346571727a0a",
    },
  };

  try {
    const res = await axios.post(
      "https://pmkisan.corover.ai/pmkisanAPI/nlp/VoiceApiBhashini/as",
      payload,
      axiosConfig
    );
    result = res.data;
  } catch (error) {
    console.error(error);
    result = null;
  }

  return result;
}

async function main() {
  const output = [];
  const answerOutput = [];

  process.on("SIGINT", () => {
    console.log("\nSaving data before exiting...");
    fs.writeFileSync("assam.json", JSON.stringify(output));
    process.exit();
  });

  for (let i = 0; i < json.length; i++) {
    let answerText = json[i].audio_asm;
    let contextID = json[i].contextId;

    answerText = answerText.replace(/<br>/gi, "");
    answerText = answerText.replace(/<b>/gi, "");
    answerText = answerText.replace(/<a[^>]*>(.*?)<\/a>/gi, "$1");
    answerText = answerText.replace(/#N\/A/g, "");
    answerText = answerText.replace(/<li><\/li>/gi, "");
    answerText = answerText.replace(/\n/gi, "");

    const payload = {
      Text: answerText,
    };

    try {
      const result = await voiceapi(payload);
      if (result) {
        const audioUrl = result["AudioURL"];
        const audioNumber = i + 1;

        console.log("%d Audio URL: \x1b[32m%s\x1b[0m", audioNumber, audioUrl);

        output.push({
          contextId: contextID,
          Answer: payload.Text,
          Answer_audio: audioUrl,
        });
      }
    } catch (error) {
      console.error(error);
      output.push({
        contextId: contextID,
        Answer: payload.Text,
        Answer_audio: "Error",
      });
    }
  }
  fs.writeFileSync("assam.json", JSON.stringify(output));
}

main();
