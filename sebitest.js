const axios = require("axios");
const fs = require("fs");
const jsonData = require("./hello.json");

const headers = {
  appId: "b3540cfc-7d56-4478-b913-56c6b8baaf7f",
  "Content-Type": "application/json",
};

const results = [];

async function sendRequest(i) {
  const English = jsonData[i].Question;
  // const Matching = jsonData[i].Question;
  const requestData = {
    query: English,
    source:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
    inputType: "TEXT",
    userToken: "94426fe5-eed4-4ff2-b3df-0a4dba0f1e3a",
  };

  try {
    const response = await axios.post(
      "https://sebi.corover.ai/sebiAPI/nlp/answer/en",
      requestData,
      { headers }
    );

    const responseBody = response.data.answer.FAQ;

    if (English === responseBody) {
      results.push({
        Question: English,
        Response: "OK",
      });
      console.log(`English: ${English} - Response: OK`);
    } else {
      results.push({
        Question: English,
        Response: "Wrong Response",
      });
      console.log(`English: ${English} - Response: Wrong Response`);
    }
  } catch (error) {
    results.push({
      Question: English,
      Response: "Error",
    });
    console.log(`Hindi: ${English} - Response: Error`);
    console.error("Error:", error);
  }
}

async function main() {
  for (let i = 0; i < jsonData.length; i++) {
    await sendRequest(i);
  }

  // Write the results to a JSON file
  fs.writeFileSync("results.json", JSON.stringify(results, null, 2), "utf-8");
}

main();
