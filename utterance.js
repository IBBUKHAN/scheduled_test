const axios = require("axios");
const fs = require("fs");
const json = require("./ibb.json");

async function getUtterances(text) {
  const url = "http://34.93.196.53:9001/getutterances";
  const headers = {
    "Content-Type": "application/json",
  };
  const data = {
    text: text,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.utterances;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function main() {
  const output = [];
  const errorOutput = [];
  const totalQuestions = json.length;
  let completedQuestions = 0;

  for (let i = 0; i < totalQuestions; i++) {
    let answerText = json[i].Question;
    const utterances = await getUtterances(answerText);

    if (utterances) {
      for (let j = 0; j < utterances.length; j++) {
        output.push({
          Utterance: utterances[j],
          Question: answerText,
        });
      }
    } else {
      errorOutput.push({ Question: answerText });
    }

    completedQuestions++;
    const percentage = ((completedQuestions / totalQuestions) * 100).toFixed(2);
    process.stdout.write(`\rProcessing... ${percentage}% completed.`);
  }

  fs.writeFileSync("utterances.json", JSON.stringify(output, null, 2));

  if (errorOutput.length > 0) {
    fs.writeFileSync("error_output.json", JSON.stringify(errorOutput, null, 2));
  }

  console.log("Processing complete!");
}

main();
