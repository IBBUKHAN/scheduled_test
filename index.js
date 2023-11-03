const fs = require("fs");
const axios = require("axios");
const jsonData = require("./hello.json");

async function testJSONData() {
  let notWorkingCount = 0;
  let totalQuestions = jsonData.length;
  const wrongResponses = [];
  const results = [];

  for (let i = 0; i < totalQuestions; i++) {
    const prompt = jsonData[i].Question;
    const response = await axios.post(
      "http://34.93.162.189:9003/bharatgpt/getResponse",
      {
        prompt: prompt,
      }
    );

    if (response.data.reply != "Sorry, I don't know") {
      results.push({
        Question: prompt,
        Matching: response.data.reply,
      });
    } else {
      // console.log("Wrong Response:", prompt);
      // notWorkingCount++;
      // // Add the wrong response to the array
      // wrongResponses.push({ "wrong response": prompt });
    }
  }

  // Write the wrong responses to a JSON file
  fs.writeFileSync("results.json", JSON.stringify(results, null, 2), "utf-8");

  // console.log("Total Questions:", totalQuestions);
  // console.log("Total Not Working Count:", notWorkingCount);
}

testJSONData();
