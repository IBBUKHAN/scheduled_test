const fs = require("fs");
const json = require("./Answer.json");

// Extract the response
async function main() {
  const output = [];

  for (let i = 0; i < json.length; i++) {
    if (json[i].answers && json[i].answers.length > 0) {
      let answerText = json[i].answers[0].answer;

      output.push({
        Answer: answerText.response,
        audio: answerText.audio,
      });
    } else {
      console.error(`No valid answers found for item at index ${i}`);
    }
  }
  fs.writeFileSync("output.json", JSON.stringify(output));
}

main();
