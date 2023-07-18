const axios = require("axios");
const fs = require("fs");
const json = require("./ibbu.json");

async function main() {
  const url = "https://sebi.corover.ai/sebiAPI/nlp/answer/hi";
  const headers = {
    appId: "b3540cfc-7d56-4478-b913-56c6b8baaf7f",
    "Content-Type": "application/json",
  };

  const output = [];

  try {
    for (let i = 0; i < json.length; i++) {
      const question = json[i].question;
      const answer = json[i].answer;

      const data = {
        query: question,
        source:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
        inputType: "TEXT",
        userToken: "94426fe5-eed4-4ff2-b3df-0a4dba0f1e3a",
      };

      try {
        const response = await axios.post(url, data, { headers });
        const responseData = response.data.answer.response;
        const translatevalue = response.data.answer.TranslatedQuery;

        const queryResponse = {
          query: question,
          Translate: translatevalue,
          old_response: responseData,
          new_response: answer,
        };

        output.push(queryResponse);
      } catch (error) {
        console.log(
          `Error for question: "${question}". Moving to the next question.`
        );
        // console.error(error);
      }
    }

    fs.writeFileSync("queryResponse.json", JSON.stringify(output));
    console.log("Query and response data saved to queryResponse.json file.");
  } catch (error) {
    console.error(error);
  }
}

main();
