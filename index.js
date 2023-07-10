const fs = require("fs");
const axios = require("axios");
const jsonData = require("./hello.json");

async function testJSONData() {
  let notWorkingCount = 0;
  let totalQuestions = jsonData.length;

  for (let i = 0; i < totalQuestions; i++) {
    const prompt = jsonData[i].Question;
    const response = await axios.post(
      "http://34.93.162.189:9003/bharatgpt/getResponse",
      {
        prompt: prompt,
      }
    );
    if (response.data.Message === "list index out of range") {
      console.log("Not Working =====>", prompt);
      notWorkingCount++;
    }
  }

  console.log("Total Questions:", totalQuestions); // Log the total number of questions
  console.log("Total Not Working Count:", notWorkingCount);
}

testJSONData();
