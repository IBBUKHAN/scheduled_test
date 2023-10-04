const fs = require("fs");
const jsonData = require("./audiosebi.json");

async function main() {
  const answerOutput = [];

  for (let i = 0; i < jsonData.answers.length; i++) {
    answerOutput.push({
      answer: {
        contextCount: 1,
        response: jsonData.answers[i].answer,
        audio: jsonData.answers[i].audio,
        options: [],
        label: jsonData.answers[i].label,
        alsoTry: jsonData.answers[i].alsoTry,
      },
    });
  }

  fs.writeFileSync("Answer.json", JSON.stringify(answerOutput, null, 2));
  console.log("Data processing complete. Check Answer.json.");
}

main();
