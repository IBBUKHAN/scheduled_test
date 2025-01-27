const fs = require("fs");
const json = require("./audiosebi.json");

const transformedJson = json.map((item) => {
  const question = item.Question;
  const answerResponse = item.Answer[0]?.answer?.response || "";
  const audioResponse = item.Answer[0]?.answer?.audio || "";
  const audioHiResponse = item.Answer_hi[0]?.answer?.audio || "";
  const answerHiResponse = item.Answer_hi[0]?.answer?.response || "";

  return {
    Question: question,
    Answer: answerResponse,
    Answer_hi:
      answerHiResponse.toLowerCase() === "no" ? "no" : answerHiResponse,
    Audio: audioResponse,
    Audio_hi: audioHiResponse.toLowerCase() === "no" ? "no" : audioHiResponse,
  };
});

fs.writeFileSync(
  "output.json",
  JSON.stringify(transformedJson, null, 2),
  "utf-8"
);

console.log("Transformed JSON has been saved to output.json");
