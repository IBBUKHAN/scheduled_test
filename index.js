const axios = require("axios");
const fs = require("fs");
const json = require("./digisaathiaudio.json");

async function voiceapi(payload) {
  let result;
  const axiosConfig = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
      "auth-Key": "2b5fb5d4-0753-4302-b661-f8580e9effb0",
      "sec-ch-ua-mobile": "?0",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "Cache-Control": "max-age=31536000",
      "app-id": "29fd4f94-f793-4227-9588-056b5ffb1318",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      Referer: "https://assistant.corover.mobi/irctc/chatbot.html",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    },
  };

  try {
    const res = await axios.post(
      "https://licdev.corover.ai/nlpAPI/convertRealTimeAudioWav",
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

  for (let i = 0; i < json.length; i++) {
    const payload = {
      sourceText: json[i].Answer_EN,
      sourceLanguage: "en",
    };

    const result = await voiceapi(payload);
    if (result) {
      output.push({
        input: payload.sourceText,
        output: result,
      });
    }
  }

  fs.writeFileSync("output.json", JSON.stringify(output));
}

main();
