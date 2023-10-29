const fs = require("fs");
const axios = require("axios");
const jsonData = require("./hello.json");

async function testJSONData() {
  let notWorkingCount = 0;
  let totalQuestions = jsonData.length;
  const wrongResponses = [];

  for (let i = 0; i < totalQuestions; i++) {
    const prompt = jsonData[i].Question_hi;
    const response = await axios.post(
      "http://34.93.162.189:9003/bharatgpt/getResponse",
      {
        prompt: prompt,
      }
    );

    if (response.data.reply === prompt) {
      console.log("OK");
    } else {
      console.log("Wrong Response:", prompt);
      notWorkingCount++;
      // Add the wrong response to the array
      wrongResponses.push({ "wrong response": prompt });
    }
  }

  // Write the wrong responses to a JSON file
  fs.writeFileSync("Wrong.json", JSON.stringify(wrongResponses));

  console.log("Total Questions:", totalQuestions);
  console.log("Total Not Working Count:", notWorkingCount);
}

testJSONData();
