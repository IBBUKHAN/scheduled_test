const axios = require("axios");
const fs = require("fs");
const jsonData = require("./hello.json");

const headers = {
  appId: "8f1a9ebe-7ce5-4c3e-bf3b-18669e4897e3",
  "Content-Type": "application/json",
};

const results = [];

async function sendRequest(i) {
  const Hindi = jsonData[i].categoryQuestion;
  const Matching = jsonData[i].contextId;
  const requestData = {
    query: Hindi,
    source:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
    inputType: "TEXT",
    userToken: "94426fe5-eed4-4ff2-b3df-0a4dba0f1e3a",
  };

  try {
    const response = await axios.post(
      "https://digisaathi.info/npciAPI/bot/sendQuery/en",
      requestData,
      { headers }
    );

    const responseBody = response.data.contextId;

    if (Matching === responseBody) {
      results.push({
        Question: Hindi,
        Response: "OK",
        Matching: responseBody,
      });
      // console.log(`Hindi: ${Hindi} - Response: OK`);
      console.log(`${results.length}. OK`);
    } else {
      results.push({
        Question: Hindi,
        Response: "Wrong Response",
        Matching: responseBody,
      });
      console.log(
        `${results.length}. Hindi: ${Hindi} - Response: Wrong Response`
      );
    }
  } catch (error) {
    results.push({
      Question: Hindi,
      Response: "Error",
    });
    console.log(`Hindi: ${Hindi} - Response: Error`);
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
