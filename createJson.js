const fs = require("fs");
const jsonData = require("./audiosebi.json");

async function main() {
  const answerOutput = [];

  for (let i = 0; i < jsonData.length; i++) {
    const answers = jsonData[i].answers;

    if (answers && answers.length > 0) {
      const answerData = answers[0].answer;

      answerOutput.push({
        answers: [
          {
            answer: {
              contextCount: answerData.contextCount,
              response: answerData.response,
              audio: answerData.audio,
              options: answerData.options,
              label: answerData.label,
              alsoTry: answerData.alsoTry,
            },
          },
        ],
      });
    }
  }

  fs.writeFileSync("Answer.json", JSON.stringify(answerOutput, null, 2));
  console.log("Data processing complete. Check Answer.json.");
}

main();
