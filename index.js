const axios = require("axios");
const fs = require("fs");
const json = require("./audiosebi.json");

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
      "https://licdev.corover.ai/nlpAPI/convertRealTimeAudio",
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

  for (let i = 0; i < json.length; i++) {
    let answerText = json[i].Answer;

    // Remove specific HTML tags from the answer text
    answerText = answerText.replace(/<br>/gi, "");
    answerText = answerText.replace(/<b>/gi, "");
    answerText = answerText.replace(/’/gi, "");
    answerText = answerText.replace(/<a[^>]*>(.*?)<\/a>/gi, "$1");
    answerText = answerText.replace(/\//g, "");
    // answerText = answerText.replace(/-/g, "");
    answerText = answerText.replace(/#N\/A/g, "");
    answerText = answerText.replace(/<li><\/li>/gi, "");
    answerText = answerText.replace(/\n/gi, "");

    const payload = {
      sourceText: answerText,
      sourceLanguage: "en",
    };

    const result = await voiceapi(payload);
    if (result) {
      const audioUrl = result["Uploaded URL"];
      const audioNumber = i + 1;

      // Display the console log with the numbered format and green Audio URL
      console.log("%d Audio URL: \x1b[32m%s\x1b[0m", audioNumber, audioUrl);

      output.push({
        Answer: payload.sourceText,
        Answer_audio: result["Uploaded URL"],
      });
      // answerOutput.push([{
      //   answer: {
      //     contextCount: 1,
      //     response: json[i].Response,
      //     audio: result["Uploaded URL"],
      //     options: [],
      //   },
      // }]);
    }
  }

  fs.writeFileSync("sebiaudio1.json", JSON.stringify(output));
  // fs.writeFileSync("Answer.json", JSON.stringify(answerOutput));
}

main();
